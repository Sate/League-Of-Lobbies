
players = [];
roomArray = [];
rooms = {};
uniques = {};
roomsARAM = {};
roomArrayARAM = [];
roomArrayNORM = [];
roomsNORM = {};

module.exports = function(io,socket){

var MATCHMAKE = function(mode){
  console.log('room array is');
  console.log(roomArray);

  // if (mode==="rank")

  for (var each in rooms.queue ){
    var player = rooms.queue[each];
    if (player.playerInfo.mode !== "norm") return;
    for (var i in roomArray){
      var room = roomArray[i];
      if (room !== '' && room !== 'queue'){
        if(rooms.queue.length == 0 ) {console.log("no players, returning function"); return false;} 
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
      if(roomArray[i] === '??'){
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
  for (var i = 0; i < rooms[room].length; i++){
    console.log(rooms[room][i].playerInfo.lane);
    if (rooms[room][i].playerInfo.lane === lane){
      return true;
    }
  }
  return false;
}
  


var connect = function(socket, data){
  if (!data) {return;}
  console.log(data);
  for (var i in data){
    data[i] = data[i].replace("script", "").replace('"','').replace('=','').replace("script>",'');
  }
  if (data.mode !== "norm"){socket.disconnect()}
  data.uid = generateID();
  if (data.mode === "aram"){data.lane = "aram"}
  uniques[data.uid] = 1;
  socket.emit('userinfoValid', data);
  socket.playerInfo = data;
  // if (data.mode === "aram"){rooms = roomsARAM; roomArray= roomArrayARAM;}
  // if (data.mode === "norm"){rooms = roomsNORM; roomArray= roomArrayNORM;}
  // if (data.mode === "rank"){joinRoom(socket, 'Rankqueue')}
  players.push(socket);
  joinRoom(socket, 'queue');
  MATCHMAKE(data.mode);
};

var joinRoom = function(socket, room){
  if (!rooms[room]){
    rooms[room] = [];
  }
  rooms[room].push(socket);
  socket.emit('newRoom', room);
  socket.emit('updateUserList', {users: getPlayersInRoom(room)});
  updateStatus(socket, 'online', room);
  // emitToRoom(room, 'updateUserList', {users: getPlayersInRoom(room)} );
  // io.sockets.in(room).emit('updateUserList', {users: getPlayersInRoom(room)});
};

var getPlayersInRoom = function(room){
  var result = [];
  var usersinroom = rooms[room];
  for (var i = 0; i < usersinroom.length; i++ ){
    result.push(usersinroom[i].playerInfo);
  }
  return result;
};

var emitToRoom = function(room, event, data){
  console.log('room is '+ room);
  var targetRoom = room === 'global' ?  players : rooms[room];
  for (var i = 0; i < targetRoom.length; i++){
    targetRoom[i].emit(event, data);
  }
}




var disconnect = function(socket){
  var rooms = findRoomsForPlayer(socket);
  console.log('player is in :');
  console.log(rooms);
  for(var room in rooms){
    if(rooms[room]){
      leaveRoom(socket, { room: rooms[room] });
    }
  }
  socket.removeAllListeners();
  players.splice(players.indexOf(socket), 1);
  console.log(roomArray);
  socket.disconnect();
};

var findRoomsForPlayer = function(socket){
  var result = []
  for (var i in rooms){
    for (var player in rooms[i]){
      if (rooms[i][player] === socket){
        result.push(i);
      }
    }
  }
  return result;
}

var leaveRoom = function(socket, data){
  updateStatus(socket, 'offline', data.room);
  console.log('dataroom is ');
  console.log(data);
  console.log('room is '+rooms[data.room]);
  rooms[data.room].splice(rooms[data.room].indexOf(socket), 1);
  if (data.room !== '' && data.room !== 'queue'){
    if (rooms[data.room].length === 0 ){
      console.log(roomArray);
      console.log(data)
      console.log(roomArray.indexOf(parseInt(data.room)))
      roomArray.splice(roomArray.indexOf(parseInt(data.room)), 1);
      console.log('splicing');
      delete rooms[data.room];
    }
  }
};

var generateID= function(){
  var temphash = Math.floor(Math.random() * 0x1000000);
  while (temphash in uniques){
    temphash = Math.floor(Math.random() * 0x1000000);
  }
  return temphash;
}
  
function updateStatus(socket, status, room){
  emitToRoom(room, 'updateStatus', { player: socket.playerInfo, status: status, room: room });
}

var requeue = function (){
  var rooms = findRoomsForPlayer(socket);
  for(var room in rooms){
    if(rooms[room]){
      leaveRoom(socket, { room: rooms[room] });
    }
  }
  joinRoom(socket, 'queue');
  MATCHMAKE();
};


return {
  connect: connect,
  disconnect:disconnect,
  emitToRoom: emitToRoom,
  requeue: requeue
}






}