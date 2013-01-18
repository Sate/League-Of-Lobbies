var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();
 



var io = require('socket.io-client');
// var MM = require("../matchMaker")(io);

describe("matchmaking functions", function(){
  var server,
    options ={
        transports: ['websocket'],
        'force new connection': true
    };

  beforeEach(function (done) {
       var client = io.connect("http://localhost:5000", options);
    // start the server
    // server = require('../app').server;

    done();
    });

  it("should have a method named checkRoomFull", function(){
    var client = io.connect("http://localhost:5000", options);
    client.emit("laneSelected");
   
    client.on("connect", function(data){
      console.log('wefwef');
      var foo = 5;
        foo.should.equal(7);
      client.emit("blahb");
      client.on('blah', function(){
        var foo = 5;
        foo.should.equal(7);
      })
    });

    // client.close();
      
      

      

  });

  // xit("should add connecting players to players array", function(){
  //   var socket= new Socket(1);
  //   var socket2 = new Socket(2);
  //   var socket3 = new Socket(3);
  //   MM.connect(socket,{lane:'jun'});
  //   MM.connect(socket2,{lane:'jun'});
  //   MM.connect(socket3,{lane:'jun'});
  //   MM.disconnect(socket2);
  //   expect(players.length).toBe(3);
  // });



  
});
