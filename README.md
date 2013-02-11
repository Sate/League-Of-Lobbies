League-Of-Lobbies
=================


## What is this?
This is a technical exercise in rapidly developing real-time javascript apps. At face value it is a matchmaking system with chat for league of legends players. Players choose a lane to play and are paired with other players of different lanes.

This uses node.js, backbone.js, mongoose.js, and websockets.

Check it out leagueoflobbies.com
## Why?

I made this both for the technical exercise and the pain-point of players of this game. The game is played in teams of 5. Each of the 5 spots on a team has a specific role in the game (called a 'lane'), and players always have a lane in mind when they want to play the game. Players are simply paired randomly however and are left to argue about who gets what lane. This app aims to resolve this by allowing players to easily find others playing complimentary lanes.

## Technical observations
I tried to keep the app fairly low level. For example using backbone over something like angular. At the beginning it felt over-engineered, and hard to decide about how many views/models to split up into, but the initial investment started paying off later on in development. For example towards the end I was able to implement the re-queue feature in only about 30 minutes, which I thought would take way longer. I gained a great deal of experience in all aspects of backbone and the websocket API.
At some points I purposely over-engineered just to explore more ground. For example I made a self-updating API at http://leagueoflobbies.com/stats which lists all players on the server, and this is synced with a backbone collection, independent of the websocket connection. 


--Main takeaways
  - Validating/catching socket data on a node.js server is extremely important. A client can open a new websocket through the chrome console and start sending events without any data, if data was expected by the server it will crash the node server. For enhanced security you would also want to validate each websocket connection. 
  - Once your backbone.js architecture is fleshed out, you really appreciate the fine control and understanding you have over all aspects of the app. Even so, the same thing can be achieved with Angular directives and a bit of work. Backbone feels a little dated and Angular would be more efficient in most cases. However in heavy animation/UI stuff Backbone may actually come out on top.
  - All animations are done in CSS3. CSS3 animations are really cool.
  - It's worth understanding websockets instead of relying on socket.io

--The matchmaker
  - The goal of the matchmaker is to make sets of 5 different lanes (top, middle, bottom, jungle, support). This sounds simple but taking into account players randomly joining/leaving existing sets it got a little complicated. Basically the current setup is:
   * When a player connects they are put into a queue
   * The queue is immediately iterated over
   * For each iteration, all current rooms are iterated over to see if the current player can fit in them as a set
   * If there is a fit, the player is removed from the queue and joined to that room. They can then chat with everyone else in the room. 
   * If all rooms have been checked and the current player can't be matched, the player is put into a new room alone.
   * Rooms and players are kept track of with a few hashes and arrays. Messages are routed with logic that find the source room, iterate over the players in it, and send messages to each player. 

   This is easy with a set amount of players, however this algorithm needs to account for players constantly joining and even leaving existing sets. For now the solution is a re-queue button for the user, which can be clicked to take them out of their current room and be re-matched. In the future I'll make this an automatic part of the algorithm. 

--Socket.io
  Socket.io seemed to have too many strange behaviors due to the responsiblities the library chose to cover. For example the github page for socketio has year old issues about memory leaks. The new engine.io seems to be pretty solid though and the author is looking to integrate it back into socket.io in the future. 

  The first iteration of this app used socketio's room managers. To reduce overhead I rewrote it using native hashes and arrays. The only thing I still use socket.io for is plain event transmission, so it should be pretty easy to convert to native websocket API or sockJS in the near future. 
  Other than that websockets work pretty well. The app is configured to only use websockets.


--Response
  
[![](http://markchatkhan.com/1.png)]







