var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , port = process.env.PORT || 5000
  , io = require('socket.io').listen(server);

var counts = {top:0, adc:0, mid:0, jun:0, sup:0, aram:0};


exports.server = server.listen(port);
io.configure(function () { 
  io.set("transports", ["websocket"]); 
  // io.set("log level", 1);
  // io.set("polling duration", 10); 
});

var counter = function(){
  counts = {top:0, adc:0, mid:0, jun:0, sup:0, aram:0};
  for (var i = 0; i<players.length; i++){
    if(players[i].playerInfo.lane){
      counts[players[i].playerInfo.lane]++;
    } else{
      counts.aram ++;
    }
  }
}

app.use(express.static(__dirname + '/'));
app.use("/stats", function(req, res, next){
  res.send(JSON.stringify(counts));
});
app.use("/about", function(req, res, next){
  res.send("I made this matchmaking site for those who don't feel like arguing about lanes. And those looking to find some quick partners for ARAM or 2-man ranked. This is an open-source project. All assets belong to riot games. ");
});





io.sockets.on('connection', function(socket){
console.log('HELLO');
setInterval(counter, 4000);
var matchMaker = require('./matchMaker')(io,socket);

    socket.on('laneSelected', function(data){
      matchMaker.connect(socket,data);
    });

    socket.on('disconnect', function(){
      matchMaker.disconnect(socket);
    });
      
    socket.on('messageSent', function(data){
      data.input = data.input.replace("script", "").replace("</", "").replace("/>","");

      matchMaker.emitToRoom(data.room, 'messageServed', {player: socket.playerInfo, message: data.input, room: data.room });

    });
});


