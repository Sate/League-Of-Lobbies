
players = [];
roomArray = [];
module.exports = function(io,socket){

var MATCHMAKE = function(){
  console.log('room array is');
  console.log(roomArray);
  for (var each in io.sockets.clients('queue')){

    var player = io.sockets.clients('queue')[each];

    for (var i in roomArray){
      var room = roomArray[i];
      if (room !== '' && room !== '/queue'){
        if(io.sockets.clients('queue').length == 0 ) {console.log("no players, returning function"); return false;} 
        if(checkRoomFull(room, player.playerInfo.lane) && room === roomArray[roomArray.length-1]){
          console.log("Room full, putting player in new room");
          leaveRoom(player, {room:"queue"});
          var newRoom = roomArray[roomArray.length-1] + 1;
          joinRoom(player, newRoom);
          roomArray.push(newRoom);
        } else if (!checkRoomFull(room, player.playerInfo.lane)){
          leaveRoom(player, {room:'queue'});
          joinRoom(player, room);
        }
      }
    } 

    if (roomArray.length === 0 || players.length <= 1){
        leaveRoom(player, {room:'queue'});
        joinRoom(player, roomArray.length);
        roomArray.push(roomArray.length);
    }
  }
}

var findNextAvailableRoom = function(lane){
  for (var i = 0; i < roomArray; i++){
    if (!checkRoomFull(roomArray[i], lane) ){
      if(roomArray[i] === 4){
        return roomArray[i];
      }
    }
  }
}
      



var checkRoomFull = function(room, lane){
  //maybe replace room
  // var room = room.replace('/','');
  console.log('Checking if'+ room +'is full ');
  console.log(lane);
  for (var i = 0; i < io.sockets.clients(room).length; i++){
    console.log(io.sockets.clients(room)[i].playerInfo.lane);
    if (io.sockets.clients(room)[i].playerInfo.lane === lane){
      return true;
    }
  }
  return false;
}
  


var connect = function(socket, data){
  if (data.lane.length != 3){
    data.lane='invalid lane, stop hacking';
  };
  socket.emit('userinfoValid', data);
  socket.playerInfo = data;
  joinRoom(socket, 'queue');
  players.push(socket);

  MATCHMAKE();
};

var joinRoom = function(socket, room){
  socket.join(room);
  socket.emit('newRoom', room);
  io.sockets.in(room).emit('updateUserList', {users: getPlayersInRoom(room)});
};

var getPlayersInRoom = function(room){
  var result = [];
  var usersinroom = io.sockets.clients(room);
  for (var i = 0; i < usersinroom.length; i++ ){
    result.push(usersinroom[i].playerInfo);
  }
  return result;
};

var disconnect = function(socket){
  var rooms = io.sockets.manager.roomClients[socket.id];
  for(var room in rooms){
    if(room && rooms[room]){
      leaveRoom(socket, { room: room.replace('/','') });
    }
  }
  socket.removeAllListeners();
  players.splice(players.indexOf(socket), 1);
  console.log(roomArray);
  socket.disconnect();
};

var leaveRoom = function(socket, data){
  updateStatus(socket, 'offline', data.room);
  if (data.room !== '' && data.room !== 'queue'){
    if (io.sockets.clients(data.room).length === 1 ){
      console.log(roomArray);
      console.log(data)
      console.log(roomArray.indexOf(parseInt(data.room)))
      roomArray.splice(roomArray.indexOf(parseInt(data.room)), 1);
      console.log('splicing');
    }
  }
  socket.leave(data.room);
};
  
function updateStatus(socket, status, room){
  room = room.replace('/','');
  io.sockets.in(room).emit('updateStatus', { player: socket.playerInfo, status: status, room: room });
}



return {
  connect: connect,
  disconnect:disconnect,
  checkRoomFull: checkRoomFull
}






}