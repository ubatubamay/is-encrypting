var express = require('express');
var router = express.Router();
const fs = require('fs');
// const bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Generate File' });
});

router.post('/file_generate', function(req, res, next) {
  var phrase = req.body.frase;
  console.log(phrase);
  var phraseEncripted = [];
  var chave = req.body.chave;
  console.log(chave);
  var sizeKey = chave.length; //5
  var sizePhrase = phrase.length;
  var j = 0;
  for(var i = 0; i<sizePhrase; i++) {
    var indice = global.arrayIndex.indexOf(phrase[i]);
    indice = parseInt(indice) + parseInt(chave[j]);
    console.log('Indice:' +indice);
    console.log(phrase[i]);
    console.log(chave[j]);
    
    if( indice >= 80 ) {
      indice = indice - 80;
    }
    phraseEncripted[i] = global.arrayIndex[indice];
    j++;
    if(j>=sizeKey) {
      j=0;
    }
  }

  console.log(phraseEncripted);

  // // write to a new file named 2pac.txt
  // fs.writeFile(chave+'.txt', phrase, (err) => {  
  //     // throws an error, you could also catch it here
  //     if (err) throw err;

  //     // success case, the file was saved
  //     console.log('Lyric saved!');
  // });
});

module.exports = router;
