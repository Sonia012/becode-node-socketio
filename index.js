const express = require(`express`);
const socket = require(`socket.io`);
const app = express();
const server = app.listen(5000, function(){
  console.log(`listening to request on port 5000`)
});
let usernames = [ ];

//Static files to serve
app.use(express.static(`public`));

//Socket setup => socket.io is gonna be sitting around on a server, waiting for
//a client/browser to make a connection and set up a websocket between the 2
// => we have to listen out to when that connection is made = see below const io declaration
const io = socket(server);
//listen out for an event called "connection" = when the 2 connect/when we make
//a connection from a browser
//we pass a variable "socket" to the function. Socket refers to that instance of
//that 1 particular socket => if we have 10 clients making a connection, each
//client is gonna have their own socket between that client and the server
io.on(`connection`, function(socket){
  console.log(`made socket connection`);
  //set username
  socket.on(`new user`, function(data, callback){
    //check if username is already taken (we don't want different people to
    //have the same username)
    if(usernames.indexOf(data) != -1) {
      callback(false)
    } else {
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }
  });
  
  socket.on(`join`, (room) => {
    console.log(room);
    socket.join(room);
  });

  //update Usernames
  function updateUsernames() {
    io.sockets.emit(`usernames`, usernames);
  }

  //socket = particular socket between the server and that client who's sending the message
  //Handle chat event
  socket.on(`send message`, function(data){
    console.log(`Got message`, data)
    io.to(room).emit(`new message`, {msg: data, user: socket.username});
  });

  //Disconnect
  socket.on(`disconnect`, function(data) {
    // if(!socket.username){
    //   console.log("disconnected");
    //   return;
    // }
    //if user disconnects, we want to remove his name from the usernames list (splice)
    //and update the usernames array
    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
    console.log("disconnected");
  })
  //handle typing event (when someone's typing, the server broadcasts to the
  //other sockets (not the original socket) the fact that someone is typing)
  socket.on(`typing`, function(data){
    socket.broadcast.emit(`typing`, data)
  })
})
