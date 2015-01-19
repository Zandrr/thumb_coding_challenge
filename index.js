var Hapi = require('hapi');
var Joi  = require('joi');
var exec = require('child_process').exec;
var fs   = require('fs');

var server = new Hapi.Server('0.0.0.0', '8000');

if(!module.parent){ //prevent server from starting when testing
  server.start();
  console.log('Server Started On localhost:8000');
}

server.route({
  method: 'POST',
  path:   '/thumbs/upload/{filename}', 
  handler: function(req,res){
    var filename = encodeURIComponent(req.params.filename); //set user param to filename
    var filedir = filename.replace(/\./g,'-'); //replace '.' with '-' to name in db

    exec('mkdir ' + filedir); //make new dir
    exec('pdftk '+ filename + ' burst output ' + filedir+'/'+filedir+'_%002d.pdf', function(err,stdout,stderr){ //use pdftk to break pdf into pages
      if(err) res(err, "error");

      exec('mogrify -format png '+filedir+'/'+filedir+'*.pdf'); //turn all pdf pages into png
      res('success');
    });

  }
});

server.route({
  method: 'GET',
  path:   '/thumbs/{filename}',
  handler: function(req,res){
    var filename = encodeURIComponent(req.params.filename); //set user param to filename

    var JSONresponse = {};
    var filedir = filename.replace(/\./g,'-'); //replace '.' with '-' so that we can access it in db

    if(filename.indexOf(".pdf") > -1){
      fs.readdir(filedir, function(err,file){
        for(i=0; i<file.length; i++){
         if( file[i].indexOf(".png") > -1) JSONresponse[file[i]]='http://localhost:8000/thumbs/'+file[i]; //add each png to the JSONresponse object
        }
          res(JSONresponse);
      });
    }
    else if(filename.indexOf(".png") > -1){
      filedir = filename.substring(0, filename.indexOf('_'+filename.match(/[0-9]+/))); // remove everything after '_<some int>'
      res.file('./'+filedir+'/'+filename);
    }
    else{
      res("file name must be either .pdf or .png")
    }

  }

});
