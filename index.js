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
  path:   '/thumbs/upload/{filename}', //make this not optional
  handler: function(req,res){
    var filename = encodeURIComponent(req.params.filename); //set user param to filename
    var filedir = filename+ '_tmp';

    exec('mkdir ' + filedir);
    exec('pdftk '+ filename + ' burst output ' + filedir+'/page_%02d.pdf', function(err,stdout,stderr){
      if(err) res("error");

      exec('mogrify -format png '+filedir+'/page*.pdf');
      res('success');
    });

  }
});

server.route({
  method: 'GET',
  path:   '/thumbs/{filename}',
  handler: function(req,res){
    var filename = encodeURIComponent(req.params.filename); //set user param to filename
    var filedir = filename+ '_tmp';

    var JSONresponse = {};

    fs.readdir('test.pdf_tmp', function(err,file){
      for(i=0; i<file.length; i++){
       if( file[i].indexOf(".png") > -1) JSONresponse[file[i]]='http://localhost:8000/thumbs/'+file[i];
      }
        res([JSONresponse]);
    });

  }

});


//try to use Joi, write tests
