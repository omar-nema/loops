//build api that will generate phrases from inputText

const nlp = require('compromise');
const express = require('express');
server = express();


server.set('port', process.env.PORT || 3000);

server.get('/', function(req, res) {
  console.log('STILL DRE')
});
//
server.get('/test', (request, response)=>{
  response.send('JUST A TEST OKAY')
});

server.listen(3000,()=>{
  console.log('Node server created at port 3000');
});



// var doc = nlp('London is calling')

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
