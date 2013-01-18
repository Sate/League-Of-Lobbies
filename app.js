var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , port = process.env.PORT || 5000
  , io = require('socket.io').listen(server);


exports.server = server.listen(port);
io.configure(function () { 
  io.set("transports", ["websocket"]); 
  // io.set("log level", 1);
  // io.set("polling duration", 10); 
});

app.use(express.static(__dirname + '/'));




io.sockets.on('connection', function(socket){
console.log('HELLO');
var matchMaker = require('./matchMaker')(io,socket);

    socket.on('laneSelected', function(data){
      matchMaker.connect(socket,data);
    });

    socket.on('disconnect', function(){
      matchMaker.disconnect(socket);
    });
      
    socket.on('messageSent', function(data){

      matchMaker.emitToRoom(data.room, 'messageServed', {player: socket.playerInfo, message: data.input, room: data.room });

    });
});


