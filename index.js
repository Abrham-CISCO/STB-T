// External components
  var app = require('express')();
  var http = require('http').createServer(app);
  var io = require('socket.io')(http);
  var bodyParser = require('body-parser').json();
  var mongoose = require('mongoose');
  var JadeFolderPath = __dirname ;
  var session = require('express-session');
  var MongoStore = require('connect-mongo')(session);

// Routes
  var Accounts = require('./Account/route')

  // Workspace routes

    var AbinetTimehert = require('./Workspaces/AbinetTimhert/route');
    var MemihranMideba = require('./Workspaces/MemhiranMideba/route');
    var RiketTimhert = require('./Workspaces/RiketTimhert/route');
    var Sebsabi = require('./Workspaces/Sebsabi/route');
    var SitateTimhert = require('./Workspaces/SierateTimhert/route');
    var Tsheafi = require('./Workspaces/Tsehafi/route');
    var messageRoute = require('./routes/messaging');

  // Shared Applications
    var Messaging = require('./SharedComponents/Messaging/route');
    var Notification = require('./SharedComponents/Notification/route');

// Models
  var socketmodel = require('./models/socket');


// Route Definations
  app.use('/AbinetTimehert',AbinetTimehert);
  app.use('/MemihranMideba',MemihranMideba);
  app.use('/RiketTimhert',RiketTimhert);
  app.use('/Sebsabi',Sebsabi);
  app.use('/SitateTimhert',SitateTimhert);
  app.use('/Tsheafi',Tsheafi);
  app.use('/Accounts',Accounts);
  app.use('/Messaging',Messaging);
  app.use('/Notification',Notification);
  
var chat = io.of('/chat')
chat.on('connection', (socket)=>{
  console.log(socket.client.id + ' connected to the chat workspace with '+socket.id);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
// io.to().emit("HI there!")

//mongoodb connection
mongoose.connect("mongodb://localhost:27017/S");
var db = mongoose.connection;

//mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// use sessions for tracking logins
app.use(session({
    secret: "Abrham",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection:db
    })
}));

// the fllowing code imports static files from the StaticFilePath and import it to jade with a URL "/static"
// This is not necessary you can ommit the "/static" and express uses the StaticFilePath itself to refer the files
var StaticFilePath = 'C:\\wamp64\\www\\STBF';
app.use('/static',express.static(StaticFilePath))


// Configuration For Jade
app.set('view engine', 'jade');
app.set('views', JadeFolderPath);

//Error Handler
// Define as the last app.use callback

app.use(function(err,req,res,next){
    res.status(err.status || 500);
    res.render('Pages/error',{
        message: err.message,
        error: {}
    });
})

http.listen(3000, () => {
  console.log('listening on *:3000');
});