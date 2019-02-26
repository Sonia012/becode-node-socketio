//Make connection to the server => define variable socket = the socket for the
//frontend (not the same as the socket variable for the backend, used in file index.js)
//This socket is running on the frontend, the other socket is running on the server
//we have access to "io" because we loaded in the library in the frontend (line 9 in "index.html")
const socket = io.connect(`http://localhost:5000`);

//Query DOM
const messageForm = $(`#messageForm`);
const message = $(`#message`);
const chat = $(`#chatWindow`);
const usernameForm = $(`#usernameForm`);
const users = $(`#users`);
const username = $(`#username`);
const error = $(`#error`);

usernameForm.submit(function(e){
  e.preventDefault();
  socket.emit(`new user`, username.val(), function(data) {
    //if user logs in, we want to hide the userForm and show the chat form
    if(data){
      $(`#namesWrapper`).hide();
      $(`#mainWrapper`).show();
    } else {
      error.html(`Username is taken`)
    }
  })
});

socket.on(`usernames`, function(data) {
  let html = [];
  //for every username that we scroll through, we are going to add to the html
  for(let i = 0; i < data.length; i++) {
    html += data[i] + `<br>`;
  }
  users.html(html);
})

messageForm.submit(function(e){
  e.preventDefault();
  console.log(`Submitted`);
  socket.emit(`send message`, message.val());
  message.val(``)
});

socket.on(`new message`, function(data){
  chat.append(`<strong>` + data.user + `</strong>: ` + data.msg + `<br>`);
})

// //Emit events
// btn.addEventListener(`click`, function(){
//   socket.emit(`chat`, {
//     //the "data" used in "socket.on(`chat`, function(data)) used in file index.js"
//     message: message.value,
//     handle: handle.value
//   })
// })
// //When someone is typing, we want to emit an event to the server and we want to
// //say to the server "someone is typing"
// message.addEventListener(`keypress`, function(){
//   socket.emit(`typing`, handle.value)
// })
//
// //Listen for events (on the frontend)
// //listen for the chat event
// socket.on(`chat`, function(data){
//   feedback.innerHTML = ``;
//   output.innerHTML += `<p><strong>` + data.handle + `: </strong>` + data.message + `</p>`
// })
// //Listen for the typing event
// socket.on(`typing`, function(data){
//   feedback.innerHTML = `<p><em>` + data + ` is typing a message...</em></p>`
// })
