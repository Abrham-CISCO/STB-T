var express = require('express');
var router = express.Router();
var mid = require('../../SharedComponents/Middlewares/index');
var classRoom_ModelAccessor = require('./models/classRoom_ModelAcessor');
var GubayeLink = "Workspaces/SierateTimhert/templates/Gubaye.jade"
var UserModelAccessor = require('../../Account/Models/user_model_accessor');
var classRoomInd_ModelAccessor = require('./models/classRoomInd_ModelAccessor');
var multer = require('multer')
var course_ModelAccessor = require('./models/courseModelAccessor')

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'C:/wamp64/www/TK/Workspaces/SierateTimhert/static');
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})

var documentFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(pdf|doc|docx|xls|jpg|jpeg|png|gif)$/))
    {
        return cb(new Error('You can upload word, excel and image files only!'))
    }
    cb(null, true);
}

const upload = multer({storage:storage, fileFilter:documentFileFilter});

// For Gubayes
    router.post('/Gubaye/Update/', function(req,res,next){
        var ClassRoomID = req.body.classID;
        var gubayeName;
        var Description;
        var leader;

        console.log(req.body)
        res.end();
        // const updateGubaye = (ClassRoomID, gubayeName, Description, leader, callback) => {    
    })
    router.get('/Gubaye/public/:GubayeID',function(req,res,next){
        var GubayeID = req.params.GubayeID;
        req.session.user.GubayeID = GubayeID;
        
        return res.render(GubayeLink,req.session)
    });
    router.post('/Gubaye/New', function(req,res,next){
        console.log(req.body)
        classRoom_ModelAccessor.createGubaye(req.body.gname,"No Description.", function(error,gubaye){
            if(error)
            {
                return res.end("Error!")     
            }
            res.end("Gubaye Created");
        })
    });
    router.get('/Gubaye_Sebsabi/:GubayeID', mid.requiresToBeLeader, function(req,res,next){
        var GubayeID = req.params.GubayeID;
        var membersTel = []
        membersTel.pop();
        req.session.user.GubayeID = GubayeID;
            // Using classRoom_ModelAcessor pull class info of the requested gubaye
                classRoom_ModelAccessor.gubayeDetail(GubayeID,function(error,gubaye){
                    if(error)
                    {
                        return next(error);                
                    }
                    for(var i = 0; i<gubaye.members.length;i++){
                        membersTel.push(gubaye.members[i].memberId)
                    }
                    UserModelAccessor.userObjectByTel(membersTel,function(error,contacts){
                        req.session.user.gubaye = gubaye; 
                        req.session.user.gubayemembers = contacts;
                        
                        UserModelAccessor.allUsers(function(error,users){
                            req.session.user.allusers = users;
                            console.log(req.session.user);
                            return res.render("Workspaces/SierateTimhert/templates/GubayeTDA.jade",req.session)
                        })

                    })

                })
    });
    router.get('/Gubaye_Nius_Sebsabi/:GubayeID/Remove/:telephone', mid.requiresToBeSTKNS, function(req,res,next){
        var GubayeID = req.params.GubayeID;
        var telephone = req.params.telephone;
        classRoomInd_ModelAccessor.leaveGroup(telephone,GubayeID, function(error,user){
            if(error)
            {
                next(error)
            }
            else
            {
                classRoom_ModelAccessor.removeMem(GubayeID,telephone,function(error, Gubaye){
                    if(error)
                    {
                        next(error)
                    }
                    else
                    {
                        res.end();
                        url = "http://localhost:3000/SirateTimhert/Gubaye_Nius_Sebsabi/"+Gubaye._id
                        res.redirect(url)
                        
                        // res.json(Gubaye);
                    }
                })
            }
        })
    });
    router.get('/Gubaye_Nius_Sebsabi/:GubayeID/MRemove/:telephone', mid.requiresToBeSTKNA, function(req,res,next){
        var GubayeID = req.params.GubayeID;
        var telephone = req.params.telephone;
        classRoomInd_ModelAccessor.leaveGroup(telephone,GubayeID, function(error,user){
            if(error)
            {
                next(error)
            }
            else
            {
                classRoom_ModelAccessor.removeMem(GubayeID,telephone,function(error, Gubaye){
                    if(error)
                    {
                        next(error)
                    }
                    else
                    {
                        res.end();
                        url = "http://localhost:3000/SirateTimhert/Gubaye_Nius_Abal/"+Gubaye._id
                        res.redirect(url)
                        
                        // res.json(Gubaye);
                    }
                })
            }
        })
    });
    router.get('/Gubaye_Nius_Sebsabi/:GubayeID', mid.requiresToBeSTKNS, function(req,res,next){
        var GubayeID = req.params.GubayeID;
        var membersTel = []
        membersTel.pop();
        req.session.user.GubayeID = GubayeID;
            // Using classRoom_ModelAcessor pull class info of the requested gubaye
                classRoom_ModelAccessor.gubayeDetail(GubayeID,function(error,gubaye){
                    if(error)
                    {
                        return next(error);                
                    }
                    for(var i = 0; i<gubaye.members.length;i++){
                        membersTel.push(gubaye.members[i].memberId)
                    }
                    UserModelAccessor.userObjectByTel(membersTel,function(error,contacts){
                        req.session.user.gubaye = gubaye; 
                        req.session.user.gubayemembers = contacts;
                        

                        classRoomInd_ModelAccessor.NonMemberUsers(GubayeID,function(error,users){
                            var tela = []
                            tela.pop();
                                for(var i = 0; i<users.length; i++)
                                {
                                    tela.push(users[i].userTel)
                                }
                                UserModelAccessor.userObjectByTel(tela,function(error, userWithName){
                                    for(var i = 0; i<users.length; i++)
                                    {

                                        users[i].name = userWithName[i].name
                                        console.log(users[i].name)
                                    }
                                    req.session.user.allusers = users;
                                    console.log(req.session.user);
                                    return res.render("Workspaces/SierateTimhert/templates/GubayeTSDA.jade",req.session)
                                })
                        })

                    })

                })
    });
    router.post('/Gubaye_Nius_Sebsabi/upload/courseoutline', mid.requiresToBeSTKNS,
     upload.single('courseOutlineFile'), function(req,res,next){
        res.json(req.file)
    });
    router.post('/Gubaye_Nius_Sebsabi/upload/book', mid.requiresToBeSTKNS,
    upload.single('bookFile'), function(req,res,next){
       res.json(req.file)
    });
    router.post('/Gubaye_Nius_Sebsabi/course/new',function(req,res,next){
        course_ModelAccessor.createCourse(req.body.name, req.body.description,req.user._id,(error, newCourse)=>{
          if(error)
          {
            
            res.json(error);    
          }
          else
          {
              res.json(newCourse)
          }
          
        })
    });
    router.get('/Gubaye_Nius_Abal/:GubayeID', mid.requiresToBeSTKNA, function(req,res,next){
        var GubayeID = req.params.GubayeID;
        var membersTel = []
        membersTel.pop();
        req.session.user.GubayeID = GubayeID;
            // Using classRoom_ModelAcessor pull class info of the requested gubaye
                classRoom_ModelAccessor.gubayeDetail(GubayeID,function(error,gubaye){
                    if(error)
                    {
                        return next(error);                
                    }
                    for(var i = 0; i<gubaye.members.length;i++){
                        membersTel.push(gubaye.members[i].memberId)
                    }
                    UserModelAccessor.userObjectByTel(membersTel,function(error,contacts){
                        req.session.user.gubaye = gubaye; 
                        req.session.user.gubayemembers = contacts;
                        

                        classRoomInd_ModelAccessor.NonMemberUsers(GubayeID,function(error,users){
                            var tela = []
                            tela.pop();
                                for(var i = 0; i<users.length; i++)
                                {
                                    tela.push(users[i].userTel)
                                }
                                UserModelAccessor.userObjectByTel(tela,function(error, userWithName){
                                    for(var i = 0; i<users.length; i++)
                                    {

                                        users[i].name = userWithName[i].name
                                        console.log(users[i].name)
                                    }
                                    req.session.user.allusers = users;
                                    console.log(req.session.user);
                                    return res.render("Workspaces/SierateTimhert/templates/GubayeTSDM.jade",req.session)
                                })
                        })

                    })

                })
    });
//  For courses
    router.get('/course/public/:courseId', function(req,res,next){
        return res.render("Workspaces/SierateTimhert/templates/course.jade",req.session)
    })
    router.get('/course/sebsabi/:courseId',mid.requiresToBeLeader, function(req,res,next){
        return res.render("Workspaces/SierateTimhert/templates/courseTDA.jade",req.session)
    })
    router.get('/course/nius_sebsabi/:courseId',mid.requiresToBeSTKNS, function(req,res,next){
        return res.render("Workspaces/SierateTimhert/templates/courseTSDA.jade",req.session)
    })
    // For Department Admins
router.get('/DepartmentAdmin', mid.requireSignIn, mid.requiresToBeLeader, function(req,res,next){
    classRoom_ModelAccessor.Gubaeyat(function(error,gubaeat){
        req.session.user.gubaeat= gubaeat;
        console.log(req.session.user.gubaeat);
        return res.render("Workspaces/SierateTimhert/templates/SireateTDA.jade",req.session);
    });
});

// For Sub Department Admins
router.get('/SubDepartmentAdmin', mid.requireSignIn,  function(req,res,next){
    classRoom_ModelAccessor.Gubaeyat(function(error,gubaeat){
        req.session.user.gubaeat= gubaeat;
        console.log(req.session.user.gubaeat);
        return res.render("Workspaces/SierateTimhert/templates/SireateTSDA.jade",req.session);
    });
});

// For Sub Department Members
router.get('/SubDepartmentMember', mid.requireSignIn, function(req,res,next){
    classRoom_ModelAccessor.Gubaeyat(function(error,gubaeat){
        req.session.user.gubaeat= gubaeat;
        console.log(req.session.user.gubaeat);
        return res.render("Workspaces/SierateTimhert/templates/SireateTSDM.jade",req.session);
    });
});

module.exports = router;