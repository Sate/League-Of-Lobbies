var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , port = process.env.PORT || 5000
  , io = require('socket.io').listen(server);


server.listen(port);
io.configure(function () { 
  io.set("transports", ["websocket"]); 
  io.set("log level", 1);
  // io.set("polling duration", 10); 
});

var MM = require("../matchMaker")(io);

describe("matchmaking functions", function(){

  var Socket = function(id){ this.id = id; }
  Socket.prototype.emit=function(){};
  Socket.prototype.join=function(){};

  it("should have a method named checkRoomFull", function(){
    expect(MM.checkRoomFull).toEqual(jasmine.any(Function));
  });

  it("should add connecting players to players array", function(){
    var socket= new Socket(1);
    var socket2 = new Socket(2);
    var socket3 = new Socket(3);
    MM.connect(socket,{lane:'jun'});
    MM.connect(socket2,{lane:'jun'});
    MM.connect(socket3,{lane:'jun'});
    MM.disconnect(socket2);
    expect(players.length).toBe(3);
  });



  
});
