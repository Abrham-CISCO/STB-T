// External components
  var express = require('express');
  var app = express();
  var http = require('http').createServer(app);
  var io = require('socket.io')(http);
  var bodyParser = require('body-parser');
  var mongoose = require('mongoose');
  var session = require('express-session');
  var MongoStore = require('connect-mongo')(session);
// Model Accessors
  var MessagingModel_Acc = require('./SharedComponents/Messaging/model_Accessor')
  var UserModel_Acc = require('./Account/Models/user_model_accessor')
  var classRoom_ModelAccessor = require('./Workspaces/SierateTimhert/models/classRoom_ModelAcessor');
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

    // Socket.io setup for messaging
    var chat = io.of('/chat')
    chat.on('connection', (socket)=>{
      console.log(socket.client.id + ' connected to the chat workspace with '+socket.id);
      

      // Register the socket Information of the user
      socket.on('client',function(myTel)
      {
        UserModel_Acc.setChatSocket(myTel,socket.id,function(error,user)
        {
          console.log(myTel + "'session registered on the database!")
        })
      });
      socket.on('chat',function(message,reciever_address,sender_address,domain){
        MessagingModel_Acc.sendMessage(sender_address,reciever_address,domain,{message:message},function()
        {
          console.log(message,reciever_address,sender_address);
        });
        UserModel_Acc.getChatSocket(reciever_address,function(error,ChatSocketID){
          socket.to(ChatSocketID).emit('chat',message,reciever_address,sender_address);
          console.log("Online Message sent to ", ChatSocketID)
        })
      });
    });
    var gubaye = io.of('gubaye')
    gubaye.on('connection',(socket)=>
    {
      // Socket for Gubaye (Class Rooms)
      socket.on('gubaye', function(gubayeName){
        classRoom_ModelAccessor.createGubaye(gubayeName,"No Description.", function(error,gubaye){
          if(!error)
          {
            console.log(gubaye," Gubaye Created");
          }
        });
      });
      // Socket for Gubaye members (Class Rooms)
      socket.on('GubayeMembers', function(gubayeId, gubayeMembersArray)
      {
        UserModel_Acc.NameArrayToTelArray(gubayeMembersArray,function(error,userTelArray){
          classRoom_ModelAccessor.memberAdder(gubayeId,userTelArray,function(error,response){
            console.log(response);
          })
        })
      });
    });
  // Parse to JSON
  app.use(bodyParser.json()); 

  // Route Definations
  app.use('/AbinetTimehert',AbinetTimehert);
  app.use('/MemihranMideba',MemihranMideba);
  app.use('/RiketTimhert',RiketTimhert);
  app.use('/Sebsabi',Sebsabi);
  app.use('/SirateTimhert',SirateTimhert);
  app.use('/Tsehafi',Tsehafi);
  app.use('/Accounts',Accounts);
  app.use('/Messaging',Messaging);
  app.use('/Notifications',Notification);

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