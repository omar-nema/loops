//phraseLibrary


//


//pre parse on server side. just an animation render.
function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    var i = 1;
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push({index: index, order: i});
        startIndex = index + searchStrLen;
        i = i+1;
    }
    return indices;
}


//flaw here is: does not account for overlapping phrases. maybe just take one.
function getTextIndices(inputRaw, phrases){
  //GET INDICES OF ALL PHRASES
  sliceIndices = []
  phrases.forEach(function(d, i){
    phraseCleaned = d.trim();
    matchedIndices = getIndicesOf(phraseCleaned, inputRaw);
    matchedIndices.forEach(function(x){
      sliceIndices.push({
        indices:  [x.index, x.index+phraseCleaned.length],
        phraseId: i, //get a real id later
        order: x.order,
        phrase: phraseCleaned
      })
    })
  })
  slicedIndices = sliceIndices.sort(function(a, b){return a.indices[0] - b.indices[0]});
  //FILL INDICES OF ALL NON-PHRASES
  nonRepetitivePhrases = [];
  startingIndex = 0;
  secondaryIndex = 0;
  console.log()
  slicedIndices.forEach(function(e, i){
    //get the phrase before each time
    startingIndex = secondaryIndex;
    secondaryIndex = e.indices[0];
    nonRepetitivePhrases.push({
      indices: [startingIndex, secondaryIndex]
      , order: 0
      , phrase: inputRaw.substring(startingIndex, secondaryIndex) + ' '
      , phraseId: 0
    })
    secondaryIndex = e.indices[1]
  })
  //COMBINE PHRASES AND NON-PHRASES
  allPhrases = nonRepetitivePhrases.concat(slicedIndices)
  allPhrases = allPhrases.sort(function(a, b){return a.indices[0] - b.indices[0]});
  allPhrases.forEach(function(d, i){
    prevElement = allPhrases[i-1];
    if (prevElement) {
      d.delay = prevElement.phrase.length + prevElement.delay;
    } else {
      d.delay = 0;
    }
  })
  return allPhrases;
}

function supplementVocabulary(doc){
  doc.match('alisse').tag('Person', 'FemaleName');
  doc.match('w').tag('Preposition');
}


document.addEventListener('DOMContentLoaded', function() {

  //DECLARE AND LOAD ASSETS
  var promises = [d3.text('./data/pocnote.txt'), d3.text('./data/phrases.txt')]
  var canvas = d3.select('.canvas');

  Promise.all(promises).then(function(values) {
    inputRaw = values[0];
    phrases = values[1]
    startSketch(inputRaw, phrases);
  });

  function getPhrases(doc){
    return doc.ngrams().list.filter(function(e){
      if (e.size == 2 && e.count > 1){
        if (
            (e.terms[0].tags['Noun'] && e.terms[1].tags['Noun'] && !e.terms[0].tags['Pronoun'] && !e.terms[1].tags['Pronoun'])
            ||
            (e.terms[0].tags['Adjective'] && e.terms[1].tags['Noun'] && !e.terms[0].tags['Pronoun'] && !e.terms[1].tags['Pronoun'])
          ) {
            // console.log('PASSED ', e.key);
            return e.key; //also avail: uid, parent  terms
          }
      }
      else if (e.size == 3 && e.count > 1){
        //may benefit from verbs. i..e 'work on myself'
        if
            ( (e.terms[0].tags['Noun'] || e.terms[0].tags['Adjective']) && (e.terms[2].tags['Noun'] || e.terms[2].tags['Adjective'])
              &&
              !(e.terms[0].tags['Pronoun'] && e.terms[1].tags['QuestionWord'] && e.terms[2].tags['Pronoun']) //maybe ake this stricter and not have pronoun sandwich
            )
           {
            return e.key;
          }
      }
      else if (e.size > 3 && e.count > 5){
        return e.key;
      }
      // for unigrams, only take if high frequency and charged sentiment. not super effective. need to adjust library.
      // else if (e.size == 1 && e.count > 10 ){
      //   if (Math.abs(sentiment.analyze(e.key)['score']) > 1){
      //     console.log(e.key,   sentiment.analyze(e.key))
      //   }
      // }
    }).map(function(i){return i.key})
  }



  function drawText(textIndexed){
    fragments = canvas.selectAll('.fragment').data(textIndexed, function(d){return d.indices[0]});

    fragments.enter().append('div')
      .attr('class', 'fragment')
      .attr('order', function(d){
        return d.order;
      })
      .attr('phraseId', function(d){
        return d.phraseId;
      })

    canvas.selectAll('.fragment')
    .transition()
    .style('opacity', 1)
    .tween("text", function(d) {
          var newText = d.phrase;
          var textLength = newText.length;
          return function (t) {
              this.textContent = newText.substr(0,
                                 Math.round( t * textLength) );
          };
      })
    .delay(function(d,i){
      return d.delay;
    })
    .duration(function(d, i){
      return (d.phrase.length)
    })
    .each(function(d,i){
      if (d.order > 1){
        // FIRST HIGHLIGHT THEN REMOVE
        sel = canvas.select('[phraseid="' + d.phraseId + '"]' + '[order="' + (d.order-1) + '"]')['_groups'][0][0];
        //.
        d3.select(sel)
          .attr('class', 'fragment hidden')
          .transition(200)
          .style('border', '1px solid #9e9ef3')
          .style('background', '#ededff')
          .transition(200)
          .delay(400)
          .style('background', 'rgb(99, 99, 225)')
          .style('color', 'gray')
        ;
      }
    })
  }


  function startSketch(inputRaw, phrases){
    //sentiment = new Sentimood(); to use sentiment to drawn new words



    console.log(axios('/test'));


    // phrases =  phrases.split("\n");
    // phrases = phrases.map(function(d){
    //   return d.trim();
    // })
    // normalized = nlp(inputRaw); //OPPORTUNITY TO NORMALIZE
    // doc = nlp(normalized.out('text'));
    // supplementVocabulary(doc);
    // let topics = doc.topics().unique().data().map(function(d){return d.text});
    //
    // //GET PHRASES
    // let grams = getPhrases(doc);
    // console.log(grams)
    // //GET INDICES OF PHRASES WITHIN TEXT ARRAY AND DRAW
    //
    // //GET INDIDCES ALSO ON BACKEND
    //
    // //
    //
    // console.log(getTextIndices(inputRaw, grams))
    // drawText(getTextIndices(inputRaw, grams))


}
}, false);




//use async.each() to parse in parallel

//1) function to parse phrases
//let phraseLibrary = ['omar is', 'big cat']

//2) read text and create this
//go throug



//phrases parsed =
//{phrase: x, index: y, order: 2}


//phrase lookup within dom

//animate: go through phrases.
