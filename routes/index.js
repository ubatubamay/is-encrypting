var express = require('express');
var router = express.Router();
const fs = require('fs');
// const bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {  
  console.log(global.arrayIndex);
  res.render('index', { title: 'Generate File' });
});

router.post('/file_generate', function(req, res, next) {
  var phrase = req.body.frase;
  var phraseEncripted = '';
  var chave = req.body.chave;
  var sizeKey = chave.length; //5
  var sizePhrase = phrase.length;
  var j = 0;
  for(var i = 0; i<sizePhrase; i++) {
    var indice = global.arrayIndex.indexOf(phrase[i]);
    indice = parseInt(indice) + parseInt(chave[j]);
    
    if( indice >= 80 ) {
      indice = indice - 80;
    }
    phraseEncripted+= ''+global.arrayIndex[indice];
    j++;
    if(j>=sizeKey) {
      j=0;
    }
  }

  res.send(phraseEncripted);

  fs.writeFile(chave+'.txt', phraseEncripted, (err) => {
      if (err) throw err;
      console.log('Arquivo salvo!');
  });
});

router.post('/file_upload', function(req, res, next){
  var formidable = require('formidable');
  var fs = require('fs');
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
    var newpath = './public/files_uploaded/' + files.filetoupload.name;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      var chaveName = files.filetoupload.name.split('.');      
      fs.readFile(newpath, 'utf-8', function (erro, data) {
          if(erro) throw erro;
         console.log('Arquivo enviado e armazenado. Chave ' + chaveName[0] + '. Conteúdo: ' + data);
          
          var phrase = '';
          var phraseEncripted = data;
          var chave = chaveName[0];
          var sizeKey = chave.length; //5
          var sizePhraseEnc = phraseEncripted.length;
          var j = 0;
          for(var i = 0; i<sizePhraseEnc; i++) {
            var indice = global.arrayIndex.indexOf(phraseEncripted[i]);
            indice = parseInt(indice) - parseInt(chave[j]);
            
            if( indice < 0 ) {
              indice = indice + 80;
              console.log(indice);
            }
            phrase+= ''+global.arrayIndex[indice];
            j++;
            if(j>=sizeKey) {
              j=0;
            }
          }
          res.send('Arquivo enviado e armazenado. Chave ' + chaveName[0] + '. Conteúdo: ' + data + '. Decriptado: ' + phrase);
      });
    });
  });
});

module.exports = router;
