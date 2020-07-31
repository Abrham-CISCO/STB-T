// External components
  var express = require('express');
  var app = express();
  var http = require('http').createServer(app);
  var io = require('socket.io')(http);
  var bodyParser = require('body-parser').json();
  var mongoose = require('mongoose');
  var session = require('express-session');
  var MongoStore = require('connect-mongo')(session);
// Routes
  // Accounts
    var Accounts = require('./Account/route')
  // Workspace routes
    var AbinetTimehert = require('./Workspaces/AbinetTimhert/route');
    var MemihranMideba = require('./Workspaces/MemhiranMideba/route');
    var RiketTimhert = require('./Workspaces/RiketTimhert/route');
    var Sebsabi = require('./Workspaces/Sebsabi/route');
    var SirateTimhert = require('./Workspaces/SierateTimhert/route');
    var Tsehafi = require('./Workspaces/Tsehafi/route');
  // Shared Applications
    var Messaging = require('./SharedComponents/Messaging/route');
    var Notification = require('./SharedComponents/Notification/route');
// Models
  var socketmodel = require('./SharedComponents/Models/socket');
// Mongoose Setup 
  //mongoose connection
  mongoose.connect("mongodb://localhost:27017/S");
  var db = mongoose.connection;
  //mongo error
  db.on('error', console.error.bind(console, 'connection error:'));
// Sessions setup : for storing sessions data on mongodb via mongoose
  // use sessions for tracking logins
  app.use(session({
      secret: "Abrham",
      resave: true,
      saveUninitialized: false,
      store: new MongoStore({
          mongooseConnection:db
      })
  }));
// Defining Static File Path
  var StaticFilePath = 'C:\\wamp64\\www\\TK';
  app.use('',express.static(StaticFilePath))
// Route Definations
  app.use('/AbinetTimehert',AbinetTimehert);
  app.use('/MemihranMideba',MemihranMideba);
  app.use('/RiketTimhert',RiketTimhert);
  app.use('/Sebsabi',Sebsabi);
  app.use('/SirateTimhert',SirateTimhert);
  app.use('/Tsehafi',Tsehafi);
  app.use('/Accounts',Accounts);
  app.use('/Messaging',Messaging);
  app.use('/Notification',Notification);
// Socket.io setup 
  var chat = io.of('/chat')
  chat.on('connection', (socket)=>{
    console.log(socket.client.id + ' connected to the chat workspace with '+socket.id);
  socket.on('chat',function(message,reciever_address){
    console.log(message,reciever_address);
    socket.to(reciever_address).emit('chat',message,reciever_address);

  });
  });
// Setting up Jade
var JadeFolderPath = __dirname ;
app.set('view engine', 'jade');
app.set('views', JadeFolderPath);
//Error Handler
// Define as the last app.use callback
app.use(function(err,req,res,next){
    res.status(err.status || 500);
    res.render('SharedComponents/error',{
        message: err.message,
        error: {}
    });
})

// Creating An Express server 
http.listen(3000, () => {
  console.log('listening on *:3000');
});

// Display Homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});