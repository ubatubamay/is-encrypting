var express = require('express');
var router = express.Router();
const fs = require('fs');
// const bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {  
  console.log(global.arrayIndex);
  res.render('index', { title: 'IS-Encrypting', 
                        urlFile: '', 
                        decriptedFile: '',
                        message: '' });
});

router.post('/file_generate', function(req, res, next) {
  var phrase = req.body.frase;
  var phraseEncripted = '';
  var chave = req.body.chave;

  var sizeKey = chave.length; //5
  if (sizeKey < 5){
    return res.render('index', { title: 'IS-Encrypting', 
                          urlFile: '', 
                          decriptedFile: '',
                          message: 'A chave deve possuir pelo menos 5 números' });
  }
  
  var sizePhrase = phrase.length;
  if (sizePhrase < 3){
    return res.render('index', { title: 'IS-Encrypting', 
                          urlFile: '', 
                          decriptedFile: '',
                          message: 'A frase deve possuir pelo menos 3 caracteres' });
  }

  var j = 0;
  for(var i = 0; i<sizePhrase; i++) {
    var indice = global.arrayIndex.indexOf(phrase[i]);
    indice = parseInt(indice) + parseInt(chave[j]);
    
    if( indice >= 79 ) {
      indice = indice - 79;
    }
    phraseEncripted+= ''+global.arrayIndex[indice];
    j++;
    if(j>=sizeKey) {
      j=0;
    }
  }

  var newPath = './public/files_generated/'+chave+'.txt';
  fs.writeFile(newPath, phraseEncripted, (err) => {
      if (err) throw err;
      res.render('index', { title: 'IS-Encrypting', 
                            urlFile: newPath, 
                            decriptedFile: '',
                            message: '' });
  });
  
});

/* Download file */
router.get('/:file(*)', function(req, res, next){
  var file = req.params.file;
  res.download(file);
});

/* Upload file */
router.post('/file_upload', function(req, res, next){
  var formidable = require('formidable');
  var fs = require('fs');
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
    var newpath = './public/files_uploaded/' + files.filetoupload.name;
    fs.copyFile(oldpath,'./public/files_uploaded/' + files.filetoupload.name, function (err){
      if (err) throw err;
      var chaveName = files.filetoupload.name.split('.');      
      fs.readFile(newpath, 'utf-8', function (erro, data) {
          if(erro) throw erro;
          
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
              indice = indice + 79;
            }
            phrase+= ''+global.arrayIndex[indice];
            j++;
            if(j>=sizeKey) {
              j=0;
            }
          }
          res.render('index', { title: 'IS-Encrypting', 
                                urlFile: '', 
                                decriptedFile: 'Conteúdo decriptado: ' + phrase,
                                message: '' });
      });
    });
    // fs.rename(oldpath, newpath, function (err) {
    //   if (err) throw err;
    //   var chaveName = files.filetoupload.name.split('.');      
    //   fs.readFile(newpath, 'utf-8', function (erro, data) {
    //       if(erro) throw erro;
          
    //       var phrase = '';
    //       var phraseEncripted = data;
    //       var chave = chaveName[0];
    //       var sizeKey = chave.length; //5
    //       var sizePhraseEnc = phraseEncripted.length;
    //       var j = 0;
    //       for(var i = 0; i<sizePhraseEnc; i++) {
    //         var indice = global.arrayIndex.indexOf(phraseEncripted[i]);
    //         indice = parseInt(indice) - parseInt(chave[j]);
            
    //         if( indice < 0 ) {
    //           indice = indice + 79;
    //         }
    //         phrase+= ''+global.arrayIndex[indice];
    //         j++;
    //         if(j>=sizeKey) {
    //           j=0;
    //         }
    //       }
    //       res.render('index', { title: 'IS-Encrypting', 
    //                             urlFile: '', 
    //                             decriptedFile: 'Conteúdo decriptado: ' + phrase,
    //                             message: '' });
    //   });
    // });
  });
});

module.exports = router;
