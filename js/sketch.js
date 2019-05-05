document.addEventListener('DOMContentLoaded', function() {

  //DECLARE AND LOAD ASSETS
  var canvas = d3.select('.canvas');
  // axiosLocal = axios.create({baseURL: 'http://localhost:3000'});
  // test = axiosLocal.get('/processedText');
  // test.then(res => {console.log(res); drawText(res.data[0])})



  var promises = [d3.text('./data/pocnote.txt'), d3.text('./data/phrases.txt')]
  Promise.all(promises).then(function(values) {
    inputRaw = values[0];
    numSections = 10;
    drawText(startSketch(inputRaw, numSections)[0]);
  });



  function drawText(textIndexed){


    numColumns = 10;
    for (i=0; i < numColumns; i++){
      canvas.append('div').attr('class', 'column');
    }


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
        d3.select(sel)
          .attr('class', 'fragment hidden')
          .transition(200)
          .style('border', '1px solid #9e9ef3')
          .style('background', '#ededff')
          .transition(200)
          .delay(400)
          .style('background', 'rgb(99, 99, 225)')
          .style('color', 'white')
        ;
      }
    })
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
