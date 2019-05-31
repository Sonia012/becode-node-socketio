//Make connection to the server => define variable socket = the socket for the
//frontend (not the same as the socket variable for the backend, used in file index.js)
//This socket is running on the frontend, the other socket is running on the server
//we have access to "io" because we loaded in the library in the frontend (line 9 in "index.html")
const socket = io.connect(`http://localhost:5000`);

//Query DOM
const message = document.getElementById(`message`);
const handle = document.getElementById(`handle`);
const btn = document.getElementById(`send`);
const output = document.getElementById(`output`);
const feedback = document.getElementById(`feedback`);

//Emit events
btn.addEventListener(`click`, function(){
  socket.emit(`chat`, {
    //the "data" used in "socket.on(`chat`, function(data)) used in file index.js"
    message: message.value,
    handle: handle.value
  })
})
//When someone is typing, we want to emit an event to the server and we want to
//say to the server "someone is typing"
message.addEventListener(`keypress`, function(){
  socket.emit(`typing`, handle.value)
})

//Listen for events (on the frontend)
//listen for the chat event
socket.on(`chat`, function(data){
  feedback.innerHTML = ``;
  output.innerHTML += `<p><strong>` + data.handle + `: </strong>` + data.message + `</p>`
})
//Listen for the typing event
socket.on(`typing`, function(data){
  feedback.innerHTML = `<p><em>` + data + ` is typing a message...</em></p>`
})
