var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var chat = io.of('/chat')
chat.on('connection', (socket)=>{
  console.log(socket.client.id + ' connected to the chat workspace with '+socket.id);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
// io.to().emit("HI there!")

http.listen(3000, () => {
  console.log('listening on *:3000');
});