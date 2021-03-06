// External components
  var express = require('express');
  var app = express();
  var bodyParser = require('body-parser');
  var mongoose = require('mongoose');
  var session = require('express-session');
  var MongoStore = require('connect-mongo')(session);
  var passport = require('passport')
  var autonumber = require('mongoose-auto-number')

// Creating An Express server 
  var http = require('http').createServer(app);
  var io = require('socket.io')(http);


// Local Imports
  var authenticate = require('./Account/authenticate')
  var config = require('./Account/config');
  var mid = require('./SharedComponents/Middlewares/index')
 // Model Accessors
  var MessagingModel_Acc = require('./SharedComponents/Messaging/model_Accessor')
  var UserModel_Acc = require('./Account/Models/user_model_accessor')
  var classRoom_ModelAccessor = require('./Workspaces/SierateTimhert/models/classRoom_ModelAcessor');
  var Course_ModelAccessor = require('./Workspaces/SierateTimhert/models/courseModelAccessor');
  var curriculum_ModelAccessor = require('./Workspaces/SierateTimhert/models/curriculumModelAccessor');
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
const { createInterface } = require('readline');
// Mongoose Setup 
  //mongoose connection
  mongoose.connect(config.mongoUrl);
  var db = mongoose.connection;
  autonumber.init(db)
  //mongo error
  db.on('error', console.error.bind(console, 'connection error:'));
// Sessions setup : for storing sessions data on mongodb via mongoose
  // use sessions for tracking logins
  app.use(session({
      name:"session-id",
      secret: "Abrham",
      resave: true,
      saveUninitialized: false,
      store: new MongoStore({
          mongooseConnection:db
      })
  }));

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// Defining Static File Path
  // var StaticFilePath = 'C:\\wamp64\\www\\TK';
  var StaticFilePath = __dirname;
  app.use('/STB',express.static(StaticFilePath))
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
//          console.log(message,reciever_address,sender_address);
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
      socket.on('CreateGubaye', function(gubayeName){
        classRoom_ModelAccessor.createGubaye(gubayeName,"No Description.", function(error,gubaye){
          if(!error)
          {
            socket.emit('CreateGubaye',"Created")
          }
        });
      });
      // Socket for Gubaye members (Class Rooms)
      socket.on('AddGubayeMembers', function(gubayeId, gubayeMembersArray)
      { 
        UserModel_Acc.NameArrayToTelArray(gubayeMembersArray,function(error,userTelArray){
          classRoom_ModelAccessor.memberAdder(gubayeId,userTelArray,function(error,response){
            socket.emit('AddGubayeMembers','Done')
          })
        })
      });
      socket.on('AddGubayeCourses', function(gubayeId, CoursesArray)
      { 
        // What does happen when a course is added to a classroom
        // An instance of (MarkList, MarklistColumnName, Book and Attendance) for that newly added gubaye is added to the course. 
        Course_ModelAccessor.courseIds(CoursesArray,function(error, course_ids){
          Course_ModelAccessor.addCourse(course_ids,gubayeId, function(error, updatedCourse){

          })
            classRoom_ModelAccessor.addCourse(gubayeId, course_ids, function(error, gubaye)
            {
              if(error)
              {
                console.error(error)
              }
              else{
                Course_ModelAccessor.addstudentsToCourse(course_ids,gubayeId,function(err,confirmation){
                  socket.emit('AddGubayeCourses',confirmation)
                })
              }
  
            })
          
        })
      });
      socket.on('UpdateGubaye',function(ClassRoomID, gubayeName, Description, leader){
        classRoom_ModelAccessor.updateGubaye(ClassRoomID,gubayeName,Description,leader,function(error, result){
          socket.emit('UpdateGubaye',"Updated")
        })
      });
      socket.on('UpdateGubaye_ForMember',function(ClassRoomID, gubayeName, Description){
        classRoom_ModelAccessor.UpdateGubaye_ForMember(ClassRoomID,gubayeName,Description,function(error, result){
          socket.emit('UpdateGubaye_ForMember',"Updated")
        })
      });
      //Used to delete Gubaye      
      // socket.on('deleteGubaye',function(ClassRoomID){
      //  classRoom_ModelAccessor.deleteGubaye(ClassRoomID, function(error,result){
      //     console.log(result);
      //     socket.emit('deleteGubaye',"Deleted")
      //   });
      // });
    });
    var curriculum = io.of('/curriculum')
    curriculum.on('connection', (socket)=>{
      socket.on('addCurriculum',function(curriculumName,gubayeID){
        curriculum_ModelAccessor.curriculumByName(curriculumName,function(err,singleCurriculum){
          curriculum_ModelAccessor.addCurriculumToGubaye(singleCurriculum._id,gubayeID,function(err,response){
            socket.emit('addCurriculum',"Added")
          })
        })
      })
      socket.on('addCourse',function(curriculumId, gradeId, courses){
        curriculum_ModelAccessor.addCourseToGrade(curriculumId,gradeId,courses,function(err, response){
          if(response)
          {          
            socket.emit('addCourse',"Successful")
          }
        })
      })
    })
    var course = io.of('/course')
    course.on('connection', (socket)=>
    {
      socket.on('updateCourse', function(registeredChanges, registeredColumnNameChanges, courseId, gubayeId){
        Course_ModelAccessor.UpdateMarkList(registeredChanges, registeredColumnNameChanges, gubayeId, courseId, function(error,notification){
          socket.emit('updateCourse',"Created")
        })
      });
      socket.on('removeCourseOutline', function(courseId){
        Course_ModelAccessor.editCourse(courseId,{courseOutline:""},function(err,resp){
          socket.emit('removeCourseOutline',  resp)
        })
      })
      socket.on('updateCourseDetail', function(courseId, courseName, description){
        Course_ModelAccessor.editCourse(courseId,{description:description,name:courseName},function(error, notification){
          socket.emit('updateCourseDetail','up to date')
        })
        
      });
      
      socket.on('updateAttendance', function(registeredChanges, courseId, gubayeId){
        Course_ModelAccessor.upadteAttenance(registeredChanges, gubayeId, courseId, function(error,notification){
          socket.emit('updateAttendance',notification)
        })
      });
    })

    // var socket = io.of('/course');
    // socket.emit('updateCourse',registeredChanges, courseId, gubayeId);
    // populate course with sample data
    // Course_ModelAccessor.populateAttendance(function(error,not){
    //   console.log("Sample data populated!")
    // }) 

    // Parse to JSON
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  
  //Here define a middleware that controls the session. the middleware should 
  //check any user requests if it is made in 5 minutes of the previous request and if it is not
  //it should Prompt the user to login again if it is it should reset the timer
  var elappsedTime, maxTime=0;

  app.use(function(req,res,next){
    if(req.session.user) {
      elappsedTime = Date.now() - req.session.user.lastAccess;
      req.session.user.lastAccess = Date.now();
      if(maxTime<elappsedTime)
      {
        maxTime = elappsedTime;
      }
    }
    else console.log("Not Excuted");

    console.log("Last User access was ",maxTime," seconds ago.");
    if(maxTime>10000000) 
      {
        maxTime = 0;
        res.redirect("/STB/Accounts/logout");
      }
      else
      {
        maxTime = 0;
        next();
      }      
  })

  

  // Route Definations
  app.use('/STB/Accounts',Accounts);
  app.use('/STB/Messaging',Messaging);
  app.use('/STB/Notifications',Notification);

  app.use('/STB/AbinetTimehert',AbinetTimehert);
  app.use('/STB/MemihranMideba',MemihranMideba);
  app.use('/STB/RiketTimhert',RiketTimhert);
  app.use('/STB/Sebsabi',Sebsabi);
  app.use('/STB/SirateTimhert',SirateTimhert);
  app.use('/STB/Tsehafi',Tsehafi);


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
http.listen(1500, () => {
  console.log('listening on port:1500');
});

app.get('/STB', function(req,res){
  res.render('Account/templates/menu.jade');
});
