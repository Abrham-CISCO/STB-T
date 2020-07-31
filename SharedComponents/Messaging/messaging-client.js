// This js is used to chat online
var socket = io('/chat');
console.log(socket.connected);
function Send(message,rec_address)
{
var message = document.getElementById("message").value;
    socket.emit('chat',message,rec_address);
}

// When Chat message arrives
socket.on('chat',function(message,address){
    console.log(message);
});