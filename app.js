//on dev
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
const {make_request} = require("./request.js");
const { ValidateFile } = require('./services/support.js');
// app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
//on production
// var fs = require('fs');
// var https = require('https');

// var express = require('express');
// var app = express();

// var options = {
//   key  : fs.readFileSync('/etc/httpd/ssl/_.cloudpbx.vn.key', 'utf8'),
//    cert : fs.readFileSync('/etc/httpd/ssl/_.cloudpbx.vn.crt', 'utf8')
// };
var serverPort = 3000;

// var server = https.createServer(options, app);
// var io = require('socket.io')(server);

///---------------------------------------------------------------------
io.on('connection', function (socket) {
    console.log('connection');
  socket.on('sendFile', function (data) {
    //   console.log(data.my_file);
    var data_result = [];
    data.my_file.forEach(file_name =>{
                var data_promise = make_request(file_name.recording, file_name.session);
                data_result.push(data_promise);
            });
     Promise.all(data_result)
            .then(result =>  {
                var data_result = [];
                result.forEach(element =>{
                    var text = JSON.parse(element.data);
                    var data_obj = new Object();
                    //save session
                    data_obj.session = element.file_name;

                    var string_content = "";
                    text.forEach(inside_element =>{
                        fs.appendFile('voice.txt',inside_element.result.hypotheses[0].transcript+"\n", function (err) {
                            if (err) console.log(err);
                        });
                        string_content += inside_element.result.hypotheses[0].transcript+". "
                    });  
                    //save content
                    data_obj.content = string_content;
                    data_result.push(data_obj);
                });
                socket.emit('receiveFile',{data: data_result});
            })
            .catch(error => console.log(error));
         
    // });
    // res.render("test_render", {data: data_result});
    // socket.emit('receiveFile',{data: data_result});

  });
});
app.listen(serverPort, function() {
  console.log('server up and running at %s port', serverPort);
});