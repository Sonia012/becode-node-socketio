const express = require(`express`);
const socket = require(`socket.io`);

//App setup
const app = express();
const server = app.listen(5000, function(){
  console.log(`listening to request on port 5000`)
});

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

  //socket = particular socket between the server and that client who's sending the message
  //"data" = the data object (message and handle) from file chat.js
  //Handle chat event
  socket.on(`chat`, function(data){
    //sockets = all the other sockets that connected to the server => the data
    //that was sent to the server 1 particular socket (client) is taken and sent
    //back to all the other clients
    io.sockets.emit(`chat`, data);
  });
  //handle typing event (when someone's typing, the server broadcasts to the
  //other sockets (not the original socket) the fact that someone is typing)
  socket.on(`typing`, function(data){
    socket.broadcast.emit(`typing`, data)
  })
})
