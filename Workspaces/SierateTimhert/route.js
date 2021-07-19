var express = require('express');
var router = express.Router();
var mid = require('../../SharedComponents/Middlewares/index');
var classRoom_ModelAccessor = require('./models/classRoom_ModelAcessor');
var GubayeLink = "Workspaces/SierateTimhert/templates/Gubaye.jade"
var UserModelAccessor = require('../../Account/Models/user_model_accessor');
var classRoomInd_ModelAccessor = require('./models/classRoomInd_ModelAccessor');
var multer = require('multer');
var curriculum_ModelAccessor = require('./models/curriculumModelAccessor');
var course_ModelAccessor = require('./models/courseModelAccessor');

const course = require('./models/course');
const curriculum = require('./models/curriculum');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, '/home/abruthtechcom/public_html/TK_REP/Workspaces/SierateTimhert/static');
    }, 
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})

var documentFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(pdf|jpg|jpeg|png|gif)$/))
    {
        return cb(new Error('You can upload word, excel and image files only!'))
    }
    cb(null, true);
}

var imageFileFilter = (req, imageFile, cb) => {
    if(!imageFile.originalname.match(/\.(jpg|jpeg|png|gif)$/))
    {
        return cb(new Error('You can upload image file only!'))
    }
    cb(null, true);
}

const upload = multer({storage:storage, fileFilter:documentFileFilter});
const uploadImage = multer({storage:storage, fileFilter:imageFileFilter});

// For Gubayes
    router.get('/Gubaye/public/:GubayeID',mid.requireSignIn,function(req,res,next){
        var GubayeID = req.params.GubayeID;
        var membersTel = []
        membersTel.pop();
        req.session.user.GubayeID = GubayeID;
        classRoom_ModelAccessor.gubayeDetail(GubayeID,function(err, gubaye){
            if(gubaye.curriculum != "60701692b1a1c822e0f45291")
            {
                curriculum_ModelAccessor.detailedCurriculumDetail(gubaye.curriculum,function(err, curriculum){
                    if(err)
                    {
                        next(err)
                    }
                    else
                    {
                        course_ModelAccessor.allCourses(function(err,allCourses){
                            classRoom_ModelAccessor.gubayeDetail(GubayeID,function(error,gubaye){
                                if(error)
                                {
                                    return next(error);                
                                }
                                if(gubaye.members.length>0)
                                {
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
                                                    }
                                                    req.session.user.allusers = users;
                                                    course_ModelAccessor.allCourses((error,courses)=>{
                                                        req.session.courses = courses
                                                        // return res.render("Workspaces/SierateTimhert/templates/courseTSDA.jade",req.session)
                                                        classRoom_ModelAccessor.notAddedCourses(GubayeID,function(error, unjoinedCourses, JoinedCourses){
                                                            req.session.unjoinedCourses = unjoinedCourses
                                                            req.session.JoinedCourses = JoinedCourses;
                                                            //All curriculums
                                                            curriculum_ModelAccessor.allCurriculums(function(err,curriculums){
                                                                req.session.curriculums = curriculums;
                                                                curriculums.forEach(curr=>{
                                                                    if(curr._id = gubaye.curriculum)
                                                                    {
                                                                        curr.grades.forEach(grade=>{
                                                                            grade.courses.forEach(course=>{
                                                                                allCourses.forEach(singleCourse=>{
                                                                                    if(singleCourse._id == course.course_id)
                                                                                    {
                                                                                        course.course_name = singleCourse.name;
                                                                                    }
                                                                                })
                                                                            })
                                                                        })
                                                                        req.session.curriculums = curriculums;
                                                                        res.render("Workspaces/SierateTimhert/templates/Gubaye.jade",req.session)                                                                                                                
                                                                    }
                                                                })
                                                            }) 
                                                        })
                                                    })
                                                })
                                        })
                                    })
                                }
                                else
                                {
                                    req.session.user.gubaye = gubaye; 
                                    req.session.user.gubayemembers =[];
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
                                                }
                                                req.session.user.allusers = users;
                                                course_ModelAccessor.allCourses((error,courses)=>{
                                                    req.session.courses = courses
                                                        res.render("Workspaces/SierateTimhert/templates/Gubaye.jade",req.session)
                                                        
                                                })
                                            })
                                    })
                                }
                            })       
                        })   
                    }
                })
            }
            else
            {
                req.session.curriculum = {};
                req.session.curriculums = [];
                classRoom_ModelAccessor.gubayeDetail(GubayeID,function(error,gubaye){
                    if(error)
                    {
                        return next(error);                
                    }
                    if(gubaye.members.length>0)
                    {
                        for(var i = 0; i<gubaye.members.length;i++){
                            membersTel.push(gubaye.members[i].memberId)
                        }
                        UserModelAccessor.userObjectByTel(membersTel,function(error,contacts){
                            req.session.user.gubaye = gubaye; 
                            req.session.user.gubayemembers = contacts;
                            classRoomInd_ModelAccessor.NonMemberUsers(GubayeID,function(error,users){
                                if(users.length > 0)
                                {
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
                                        }
                                        req.session.user.allusers = users;
                                        course_ModelAccessor.allCourses((error,courses)=>{
                                                req.session.courses = courses
                                                res.render("Workspaces/SierateTimhert/templates/Gubaye.jade",req.session)     
                                            })               
                                    })
                                }
                                else
                                {
                                    req.session.user.allusers = [];
                                    course_ModelAccessor.allCourses((error,courses)=>{
                                            req.session.courses = courses
                                            res.render("Workspaces/SierateTimhert/templates/Gubaye.jade",req.session)     
                                        })        
                                }
                            })
                        })
                    }
                    else
                    {
                        req.session.user.gubaye = gubaye; 
                        req.session.user.gubayemembers =[];
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
                                    }
                                    req.session.user.allusers = users;
                                    course_ModelAccessor.allCourses((error,courses)=>{
                                            req.session.courses = courses
                                            res.render("Workspaces/SierateTimhert/templates/Gubaye.jade",req.session)
                                    })
                                })
                        })
                    }
                })       
            }    
        })
    });
    router.post('/Gubaye/New',mid.requireSignIn, function(req,res,next){
        classRoom_ModelAccessor.createGubaye(req.body.gname,"No Description.", function(error,gubaye){
            if(error)
            {
                return res.end("Error!")     
            }
            res.end("Gubaye Created");
        })
    });
    router.get('/Gubaye_Sebsabi/:GubayeID',mid.requireSignIn, mid.requiresToBeLeader, mid.updateUserData, function(req,res,next){
        var GubayeID = req.params.GubayeID;
        var membersTel = []
        membersTel.pop();
        req.session.user.GubayeID = GubayeID;
        classRoom_ModelAccessor.gubayeDetail(GubayeID,function(err, gubaye){
            if(gubaye.curriculum != "60701692b1a1c822e0f45291")
            {
                curriculum_ModelAccessor.detailedCurriculumDetail(gubaye.curriculum,function(err, curriculum){
                    if(err)
                    {
                        next(err)
                    }
                    else
                    {
                        course_ModelAccessor.allCourses(function(err,allCourses){
                            classRoom_ModelAccessor.gubayeDetail(GubayeID,function(error,gubaye){
                                if(error)
                                {
                                    return next(error);                
                                }
                                if(gubaye.members.length>0)
                                {
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
                                                    }
                                                    req.session.user.allusers = users;
                                                    course_ModelAccessor.allCourses((error,courses)=>{
                                                        req.session.courses = courses
                                                        // return res.render("Workspaces/SierateTimhert/templates/courseTSDA.jade",req.session)
                                                        classRoom_ModelAccessor.notAddedCourses(GubayeID,function(error, unjoinedCourses, JoinedCourses){
                                                            req.session.unjoinedCourses = unjoinedCourses
                                                            req.session.JoinedCourses = JoinedCourses;
                                                            //All curriculums
                                                            curriculum_ModelAccessor.allCurriculums(function(err,curriculums){
                                                                req.session.curriculums = curriculums;
                                                                curriculums.forEach(curr=>{
                                                                    if(curr._id = gubaye.curriculum)
                                                                    {
                                                                        curr.grades.forEach(grade=>{
                                                                            grade.courses.forEach(course=>{
                                                                                allCourses.forEach(singleCourse=>{
                                                                                    if(singleCourse._id == course.course_id)
                                                                                    {
                                                                                        course.course_name = singleCourse.name;
                                                                                    }
                                                                                })
                                                                            })
                                                                        })
                                                                        req.session.curriculums = curriculums;
                                                                        res.render("Workspaces/SierateTimhert/templates/GubayeTDA.jade",req.session)                                                                                                                
                                                                    }
                                                                })
                                                            }) 
                                                        })
                                                    })
                                                })
                                        })
                                    })
                                }
                                else
                                {
                                    req.session.user.gubaye = gubaye; 
                                    req.session.user.gubayemembers =[];
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
                                                }
                                                req.session.user.allusers = users;
                                                course_ModelAccessor.allCourses((error,courses)=>{
                                                    req.session.courses = courses
                                                        res.render("Workspaces/SierateTimhert/templates/GubayeTDA.jade",req.session)
                                                        
                                                })
                                            })
                                    })
                                }
                            })       
                        })   
                    }
                })
            }
            else
            {
                req.session.curriculum = {};
                req.session.curriculums = [];
                classRoom_ModelAccessor.gubayeDetail(GubayeID,function(error,gubaye){
                    if(error)
                    {
                        return next(error);                
                    }
                    if(gubaye.members.length>0)
                    {
                        for(var i = 0; i<gubaye.members.length;i++){
                            membersTel.push(gubaye.members[i].memberId)
                        }
                        UserModelAccessor.userObjectByTel(membersTel,function(error,contacts){
                            req.session.user.gubaye = gubaye; 
                            req.session.user.gubayemembers = contacts;
                            classRoomInd_ModelAccessor.NonMemberUsers(GubayeID,function(error,users){
                                if(users.length > 0)
                                {
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
                                        }
                                        req.session.user.allusers = users;
                                        course_ModelAccessor.allCourses((error,courses)=>{
                                                req.session.courses = courses
                                                res.render("Workspaces/SierateTimhert/templates/GubayeTDA.jade",req.session)     
                                            })               
                                    })
                                }
                                else
                                {
                                    req.session.user.allusers = [];
                                    course_ModelAccessor.allCourses((error,courses)=>{
                                            req.session.courses = courses
                                            res.render("Workspaces/SierateTimhert/templates/GubayeTDA.jade",req.session)     
                                        })        
                                }
                            })
                        })
                    }
                    else
                    {
                        req.session.user.gubaye = gubaye; 
                        req.session.user.gubayemembers =[];
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
                                    }
                                    req.session.user.allusers = users;
                                    course_ModelAccessor.allCourses((error,courses)=>{
                                            req.session.courses = courses
                                            res.render("Workspaces/SierateTimhert/templates/GubayeTDA.jade",req.session)
                                    })
                                })
                        })
                    }
                })       
            }    
        })
    });
    router.get('/Gubaye_Nius_Sebsabi/:GubayeID/Remove/:telephone',mid.requireSignIn, mid.requiresToBeSTKNS,mid.updateUserData, function(req,res,next){
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
                        url = "/STB/SirateTimhert/Gubaye_Nius_Sebsabi/"+Gubaye._id
                        res.redirect(url)
                        
                        // res.json(Gubaye);
                    }
                })
            }
        })
    });
    router.get('/Gubaye_Nius_Abal/:GubayeID/MRemove/:telephone',mid.requireSignIn, mid.requiresToBeSTKNA,mid.updateUserData, function(req,res,next){
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
                        url = "/STB/SirateTimhert/Gubaye_Nius_Abal/"+Gubaye._id
                        res.redirect(url)
                        
                        // res.json(Gubaye);
                    }
                })
            }
        })
    });
    router.get('/Gubaye_Nius_Sebsabi/:GubayeID',mid.requireSignIn, mid.requiresToBeSTKNS,mid.updateUserData, function(req,res,next){
        var GubayeID = req.params.GubayeID;
        var membersTel = []
        membersTel.pop();
        req.session.user.GubayeID = GubayeID;
        classRoom_ModelAccessor.gubayeDetail(GubayeID,function(err, gubaye){
            if(gubaye.curriculum != "60701692b1a1c822e0f45291")
            {
                curriculum_ModelAccessor.detailedCurriculumDetail(gubaye.curriculum,function(err, curriculum){
                    if(err)
                    {
                        next(err)
                    }
                    else
                    {
                        course_ModelAccessor.allCourses(function(err,allCourses){
                            classRoom_ModelAccessor.gubayeDetail(GubayeID,function(error,gubaye){
                                if(error)
                                {
                                    return next(error);                
                                }
                                if(gubaye.members.length>0)
                                {
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
                                                    }
                                                    req.session.user.allusers = users;
                                                    course_ModelAccessor.allCourses((error,courses)=>{
                                                        req.session.courses = courses
                                                        // return res.render("Workspaces/SierateTimhert/templates/courseTSDA.jade",req.session)
                                                        classRoom_ModelAccessor.notAddedCourses(GubayeID,function(error, unjoinedCourses, JoinedCourses){
                                                            req.session.unjoinedCourses = unjoinedCourses
                                                            req.session.JoinedCourses = JoinedCourses;
                                                            //All curriculums
                                                            curriculum_ModelAccessor.allCurriculums(function(err,curriculums){
                                                                req.session.curriculums = curriculums;
                                                                curriculums.forEach(curr=>{
                                                                    if(curr._id == gubaye.curriculum)
                                                                    {
                                                                        curr.grades.forEach(grade=>{
                                                                            grade.courses.forEach(course=>{
                                                                                allCourses.forEach(singleCourse=>{
                                                                                    if(singleCourse._id == course.course_id) course.course_name = singleCourse.name;
                                                                                })
                                                                            })
                                                                        })
                                                                    }
                                                                })
                                                                res.render("Workspaces/SierateTimhert/templates/GubayeTSDA.jade",req.session)                                                                                                                
                                                            }) 
                                                        })
                                                    })
                                                })
                                        })
                                    })
                                }
                                else
                                {
                                    req.session.user.gubaye = gubaye; 
                                    req.session.user.gubayemembers =[];
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
                                                }
                                                req.session.user.allusers = users;
                                                course_ModelAccessor.allCourses((error,courses)=>{
                                                    req.session.courses = courses
                                                        res.render("Workspaces/SierateTimhert/templates/GubayeTSDA.jade",req.session)
                                                        
                                                })
                                            })
                                    })
                                }
                            })       
                        })   
                    }
                })
            }
            else
            {
                req.session.curriculum = {};
                curriculum_ModelAccessor.allCurriculums(function(err,curriculums){
                    req.session.curriculums = curriculums;
                    classRoom_ModelAccessor.gubayeDetail(GubayeID,function(error,gubaye){
                        if(error)
                        {
                            return next(error);                
                        }
                        if(gubaye.members.length>0)
                        {
                            for(var i = 0; i<gubaye.members.length;i++){
                                membersTel.push(gubaye.members[i].memberId)
                            }
                            UserModelAccessor.userObjectByTel(membersTel,function(error,contacts){
                                req.session.user.gubaye = gubaye; 
                                req.session.user.gubayemembers = contacts;
                                classRoomInd_ModelAccessor.NonMemberUsers(GubayeID,function(error,users){
                                    if(users.length > 0)
                                    {
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
                                            }
                                            req.session.user.allusers = users;
                                            course_ModelAccessor.allCourses((error,courses)=>{
                                                    req.session.courses = courses
                                                    res.render("Workspaces/SierateTimhert/templates/GubayeTSDA.jade",req.session)     
                                                })               
                                        })
                                    }
                                    else
                                    {
                                        req.session.user.allusers = [];
                                        course_ModelAccessor.allCourses((error,courses)=>{
                                                req.session.courses = courses
                                                res.render("Workspaces/SierateTimhert/templates/GubayeTSDA.jade",req.session)     
                                            })        
                                    }
                                })
                            })
                        }
                        else
                        {
                            req.session.user.gubaye = gubaye; 
                            req.session.user.gubayemembers =[];
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
                                        }
                                        req.session.user.allusers = users;
                                        course_ModelAccessor.allCourses((error,courses)=>{
                                                req.session.courses = courses
                                                res.render("Workspaces/SierateTimhert/templates/GubayeTSDA.jade",req.session)
                                        })
                                    })
                            })
                        }
                    })       
                });
            }    
        })
    }); 
    router.post('/Gubaye_Nius_Sebsabi/upload/gubaye/:gubayeId/profileImage',mid.requireSignIn, mid.requiresToBeSTKNS,mid.updateUserData,
        uploadImage.single('gubayePicFile'), function(req,res,next){
             var gubayeId = req.params.gubayeId;
             var img = "/STB/Workspaces/SierateTimhert/static/" + req.file.originalname;
             classRoom_ModelAccessor.ussignGubayePic(gubayeId,img,function(err,resp){
                var url = "/STB/SirateTimhert/Gubaye_Nius_Sebsabi/"+gubayeId;
                res.redirect(url);
            })
    });
    router.post('/Gubaye_Nius_Sebsabi/upload/:courseId/courseoutline',mid.requireSignIn, mid.requiresToBeSTKNS,mid.updateUserData,
     upload.single('courseOutlineFile'), function(req,res,next){
         var courseId = req.params.courseId;
        course_ModelAccessor.courseDetail(courseId,function(error, singleCourse){
            singleCourse.courseOutline = "/STB/Workspaces/SierateTimhert/static/" + req.file.originalname
            course_ModelAccessor.editCourse(courseId,{courseOutline:singleCourse.courseOutline},function(error,confirmation){
                if(error)
                {
                    next(error)
                }
                else
                {
                    var url="/STB/SirateTimhert/course/nius_sebsabi/"+courseId
                    res.redirect(url) 
                }
            })
        })

    });
    router.post('/Gubaye_Nius_Sebsabi/upload/:courseId/book',mid.requireSignIn, mid.requiresToBeSTKNS,mid.updateUserData,
    upload.single('bookFile'), function(req,res,next){
        var courseId = req.params.courseId;
        course_ModelAccessor.courseDetail(courseId,function(error,singleCourse){
            singleCourse.books.push({bookName:req.body.bookname,filePath:req.file.originalname})
            course_ModelAccessor.editCourse(courseId,{books:singleCourse.books},function(error,confirmation){
                if(error)
                {
                    next(error)
                }
                else
                {
                    var url="../../../../SirateTimhert/course/nius_sebsabi/"+courseId
                    res.redirect(url) 
                }
            })
        })
    });
    router.post('/Gubaye_Nius_Sebsabi/course/new',mid.requireSignIn,mid.requiresToBeSTKNS,function(req,res,next){
        course_ModelAccessor.createCourse(req.body.name, req.body.description,req.user._id,(error, newCourse)=>{
          if(error)
          {
            res.json(error);    
          }
          else
          {
              res.redirect('/STB/SirateTimhert/SubDepartmentAdmin')
          }
          
        })
    });
    router.get('/Gubaye_Nius_Abal/:GubayeID',mid.requireSignIn, mid.requiresToBeSTKNA,mid.updateUserData, function(req,res,next){
        var GubayeID = req.params.GubayeID;
        var membersTel = []
        membersTel.pop();
        req.session.user.GubayeID = GubayeID;
        classRoom_ModelAccessor.gubayeDetail(GubayeID,function(err, gubaye){
            if(gubaye.curriculum != "60701692b1a1c822e0f45291")
            {
                curriculum_ModelAccessor.detailedCurriculumDetail(gubaye.curriculum,function(err, curriculum){
                    if(err)
                    {
                        next(err)
                    }
                    else
                    {
                        course_ModelAccessor.allCourses(function(err,allCourses){
                            classRoom_ModelAccessor.gubayeDetail(GubayeID,function(error,gubaye){
                                if(error)
                                {
                                    return next(error);                
                                }
                                if(gubaye.members.length>0)
                                {
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
                                                    }
                                                    req.session.user.allusers = users;
                                                    course_ModelAccessor.allCourses((error,courses)=>{
                                                        req.session.courses = courses
                                                        // return res.render("Workspaces/SierateTimhert/templates/courseTSDA.jade",req.session)
                                                        classRoom_ModelAccessor.notAddedCourses(GubayeID,function(error, unjoinedCourses, JoinedCourses){
                                                            req.session.unjoinedCourses = unjoinedCourses
                                                            req.session.JoinedCourses = JoinedCourses;
                                                            //All curriculums
                                                            curriculum_ModelAccessor.allCurriculums(function(err,curriculums){
                                                                req.session.curriculums = curriculums;
                                                                curriculums.forEach(curr=>{
                                                                    if(curr._id = gubaye.curriculum)
                                                                    {
                                                                        curr.grades.forEach(grade=>{
                                                                            grade.courses.forEach(course=>{
                                                                                allCourses.forEach(singleCourse=>{
                                                                                    if(singleCourse._id == course.course_id)
                                                                                    {
                                                                                        course.course_name = singleCourse.name;
                                                                                    }
                                                                                })
                                                                            })
                                                                        })
                                                                        req.session.curriculums = curriculums;
                                                                        res.render("Workspaces/SierateTimhert/templates/GubayeTSDM.jade",req.session)                                                                                                                
                                                                    }
                                                                })
                                                            }) 
                                                        })
                                                    })
                                                })
                                        })
                                    })
                                }
                                else
                                {
                                    req.session.user.gubaye = gubaye; 
                                    req.session.user.gubayemembers =[];
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
                                                }
                                                req.session.user.allusers = users;
                                                course_ModelAccessor.allCourses((error,courses)=>{
                                                    req.session.courses = courses
                                                        res.render("Workspaces/SierateTimhert/templates/GubayeTSDM.jade",req.session)
                                                        
                                                })
                                            })
                                    })
                                }
                            })       
                        })   
                    }
                })
            }
            else
            {
                req.session.curriculum = {};
                req.session.curriculums = [];
                classRoom_ModelAccessor.gubayeDetail(GubayeID,function(error,gubaye){
                    if(error)
                    {
                        return next(error);                
                    }
                    if(gubaye.members.length>0)
                    {
                        for(var i = 0; i<gubaye.members.length;i++){
                            membersTel.push(gubaye.members[i].memberId)
                        }
                        UserModelAccessor.userObjectByTel(membersTel,function(error,contacts){
                            req.session.user.gubaye = gubaye; 
                            req.session.user.gubayemembers = contacts;
                            classRoomInd_ModelAccessor.NonMemberUsers(GubayeID,function(error,users){
                                if(users.length > 0)
                                {
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
                                        }
                                        req.session.user.allusers = users;
                                        course_ModelAccessor.allCourses((error,courses)=>{
                                                req.session.courses = courses
                                                res.render("Workspaces/SierateTimhert/templates/GubayeTSDM.jade",req.session)     
                                            })               
                                    })
                                }
                                else
                                {
                                    req.session.user.allusers = [];
                                    course_ModelAccessor.allCourses((error,courses)=>{
                                            req.session.courses = courses
                                            res.render("Workspaces/SierateTimhert/templates/GubayeTSDM.jade",req.session)     
                                        })        
                                }
                            })
                        })
                    }
                    else
                    {
                        req.session.user.gubaye = gubaye; 
                        req.session.user.gubayemembers =[];
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
                                    }
                                    req.session.user.allusers = users;
                                    course_ModelAccessor.allCourses((error,courses)=>{
                                            req.session.courses = courses
                                            res.render("Workspaces/SierateTimhert/templates/GubayeTSDM.jade",req.session)
                                    })
                                })
                        })
                    }
                })       
            }    
        })
    });
//  For courses
    router.get('/course/public/:courseId',mid.requireSignIn, function(req,res,next){
        return res.render("Workspaces/SierateTimhert/templates/course.jade",req.session)
    })
    router.get('/course/sebsabi/:courseId',mid.requireSignIn,mid.updateUserData, function(req,res,next){
        course_ModelAccessor.courseDetail(req.params.courseId,function(error, returnedCourse)
        {
            if(error)
            {
                next(error)
            }
            else
            {
                req.session.returnedCourse = returnedCourse;
                course_ModelAccessor.allCourses((courses)=>{
                    req.session.courses = courses
                    var gubayeIds = []
                    gubayeIds.pop();
                    returnedCourse.markListColumnName.forEach(courseColumnName => {
                        gubayeIds.push(courseColumnName.classRoomId)
                    })
                    classRoom_ModelAccessor.gubayeIdArrayToNameArray(gubayeIds, 
                        function(error,gubayeNameArr){
                            if(error)
                            {
                                next(error)
                            }
                            else
                            {
                                req.session.classRooms = gubayeNameArr;
                                UserModelAccessor.userData(returnedCourse.createdBy,function(error,user){
                                    req.session.returnedCourse.createdBy = user.name;
                                    return res.render("Workspaces/SierateTimhert/templates/courseTDA.jade",req.session)                    
                                })
                            }
                        })

                })
            }
        });
    })
    router.get('/course/sebsabi/:courseId/:gubayeId',mid.requireSignIn,mid.requiresToBeLeader,mid.updateUserData, function(req,res,next){
        course_ModelAccessor.courseDetail(req.params.courseId,function(error, returnedCourse)
        { 
            if(error)
            {
                next(error)
            }
            else
            {
                returnedCourse.markList.sort((b,a)=> {
                    var aColumn = (a.column_1_value + a.column_2_value + a.column_3_value + a.column_4_value + a.column_5_value
                        + a.column_6_value + a.column_7_value + a.column_8_value + a.column_9_value + a.column_10_value);
                    var bColumn = (b.column_1_value + b.column_2_value + b.column_3_value + b.column_4_value + b.column_5_value
                        + b.column_6_value + b.column_7_value + b.column_8_value + b.column_9_value + b.column_10_value);

                    return aColumn - bColumn
                })
                req.session.returnedCourse = returnedCourse;
                course_ModelAccessor.allCourses((courses)=>{
                    req.session.courses = courses
                    var gubayeIds = []
                    gubayeIds.pop();
                    returnedCourse.markListColumnName.forEach(courseColumnName => {
                        gubayeIds.push(courseColumnName.classRoomId)
                    })
                                UserModelAccessor.userData(returnedCourse.createdBy,function(error,user)
                                {
                                    req.session.returnedCourse.createdBy = user.name;
                                    classRoom_ModelAccessor.gubayeDetail(req.params.gubayeId, function(error,classRoom){
                                        req.session.classRoom = classRoom;
                                        return res.render("Workspaces/SierateTimhert/templates/courseClassRoomTDA.jade",req.session)                    
                                    })
                                })                          
                })
            }
        });
    })
    router.get('/course/Gubaye_Nius_Sebsabi/:courseId/:gubayeId',mid.requireSignIn,mid.requiresToBeSTKNS,mid.updateUserData, function(req,res,next){
        course_ModelAccessor.courseDetail(req.params.courseId,function(error, returnedCourse)
        { 
            if(error)
            {
                next(error)
            }
            else
            {
                returnedCourse.markList.sort((b,a)=> {
                    var aColumn = (a.column_1_value + a.column_2_value + a.column_3_value + a.column_4_value + a.column_5_value
                        + a.column_6_value + a.column_7_value + a.column_8_value + a.column_9_value + a.column_10_value);
                    var bColumn = (b.column_1_value + b.column_2_value + b.column_3_value + b.column_4_value + b.column_5_value
                        + b.column_6_value + b.column_7_value + b.column_8_value + b.column_9_value + b.column_10_value);

                    return aColumn - bColumn
                })
                req.session.returnedCourse = returnedCourse;
                course_ModelAccessor.allCourses((courses)=>{
                    req.session.courses = courses
                    var gubayeIds = []
                    gubayeIds.pop();
                    returnedCourse.markListColumnName.forEach(courseColumnName => {
                        gubayeIds.push(courseColumnName.classRoomId)
                    })
                                UserModelAccessor.userData(returnedCourse.createdBy,function(error,user)
                                {
                                    req.session.returnedCourse.createdBy = user.name;
                                    classRoom_ModelAccessor.gubayeDetail(req.params.gubayeId, function(error,classRoom){
                                        req.session.classRoom = classRoom;
                                        return res.render("Workspaces/SierateTimhert/templates/courseClassRoomTSDA.jade",req.session)                    
                                    })
                                })                          
                })
            }
        });
    })
    router.get('/course/Gubaye_Nius_Abal/:courseId/:gubayeId',mid.requireSignIn,mid.requiresToBeSTKNA,mid.updateUserData, function(req,res,next){
        course_ModelAccessor.courseDetail(req.params.courseId,function(error, returnedCourse)
        { 
            if(error)
            {
                next(error)
            }
            else
            {
                returnedCourse.markList.sort((b,a)=> {
                    var aColumn = (a.column_1_value + a.column_2_value + a.column_3_value + a.column_4_value + a.column_5_value
                        + a.column_6_value + a.column_7_value + a.column_8_value + a.column_9_value + a.column_10_value);
                    var bColumn = (b.column_1_value + b.column_2_value + b.column_3_value + b.column_4_value + b.column_5_value
                        + b.column_6_value + b.column_7_value + b.column_8_value + b.column_9_value + b.column_10_value);

                    return aColumn - bColumn
                })
                req.session.returnedCourse = returnedCourse;
                course_ModelAccessor.allCourses((courses)=>{
                    req.session.courses = courses
                    var gubayeIds = []
                    gubayeIds.pop();
                    returnedCourse.markListColumnName.forEach(courseColumnName => {
                        gubayeIds.push(courseColumnName.classRoomId)
                    })
                                UserModelAccessor.userData(returnedCourse.createdBy,function(error,user)
                                {
                                    req.session.returnedCourse.createdBy = user.name;
                                    classRoom_ModelAccessor.gubayeDetail(req.params.gubayeId, function(error,classRoom){
                                        req.session.classRoom = classRoom;
                                        return res.render("Workspaces/SierateTimhert/templates/courseClassRoomTSDm.jade",req.session)                    
                                    })
                                })                          
                })
            }
        });
    })
    router.get('/course/public/:courseId/:gubayeId',mid.requireSignIn, function(req,res,next){
        course_ModelAccessor.courseDetail(req.params.courseId,function(error, returnedCourse)
        { 
            if(error)
            {
                next(error)
            }
            else
            {
                req.session.returnedCourse = returnedCourse;
                course_ModelAccessor.allCourses((courses)=>{
                    req.session.courses = courses
                    var gubayeIds = []
                    gubayeIds.pop();
                    returnedCourse.markListColumnName.forEach(courseColumnName => {
                        gubayeIds.push(courseColumnName.classRoomId)
                    })
                                UserModelAccessor.userData(returnedCourse.createdBy,function(error,user)
                                {
                                    req.session.returnedCourse.createdBy = user.name;
                                    classRoom_ModelAccessor.gubayeDetail(req.params.gubayeId, function(error,classRoom){
                                        req.session.classRoom = classRoom;
                                        return res.render("Workspaces/SierateTimhert/templates/courseClassRoomPublic.jade",req.session)                    
                                    })
                                })                          
                })
            }
        });
    })
    router.get('/course/nius_sebsabi/:courseId',mid.requireSignIn,mid.requiresToBeSTKNS,mid.updateUserData, function(req,res,next){
        course_ModelAccessor.courseDetail(req.params.courseId,function(error, returnedCourse)
        {
            if(error)
            {
                next(error)
            }
            else
            {
                req.session.returnedCourse = returnedCourse;
                course_ModelAccessor.allCourses((courses)=>{
                    req.session.courses = courses
                    var gubayeIds = []
                    gubayeIds.pop();
                    returnedCourse.markListColumnName.forEach(courseColumnName => {
                        gubayeIds.push(courseColumnName.classRoomId)
                    })
                    classRoom_ModelAccessor.gubayeIdArrayToNameArray(gubayeIds, 
                        function(error,gubayeNameArr){
                            if(error)
                            {
                                next(error)
                            }
                            else
                            {
                                req.session.classRooms = gubayeNameArr;
                                UserModelAccessor.userData(returnedCourse.createdBy,function(error,user){
                                    req.session.returnedCourse.createdBy = user.name;
                                    return res.render("Workspaces/SierateTimhert/templates/courseTSDA.jade",req.session)                    
                                })
                            }
                        })

                })
            }
        });
    })
    router.get('/course/remove/:courseID/:gubayeId',mid.requireSignIn,mid.requiresToBeSTKNS,mid.updateUserData, function(req,res,next){
        var courseId = req.params.courseID;
        var gubayeId = req.params.gubayeId;
        classRoom_ModelAccessor.removeCourse(courseId,gubayeId,function(error,notification)
        {
            if(error)
            {
                next(error)
            }
            else
            {
                var url = '/STB/SirateTimhert/Gubaye_Nius_Sebsabi/'+gubayeId;
                res.redirect(url);
            }
        })

    })
    router.post('/course/:courseId/:gubayeId/attendance',mid.requireSignIn, function(req,res,next){
        var courseId = req.params.courseId;
        var gubayeId = req.params.gubayeId;
        course_ModelAccessor.addAttendanceColumn(req.body.newDate,req.body.remark,gubayeId, courseId, function(err, course){
            if(err)
            {
                next(err)
            }
            else
            {
                res.end();
                url = "/STB/SirateTimhert/course/Gubaye_Nius_Sebsabi/"+courseId+"/"+gubayeId
                res.redirect(url)
                res.json(course)
            }
        })
    })
    router.post('/course/:courseId/:gubayeId/attendanceAbal',mid.requireSignIn, function(req,res,next){
        var courseId = req.params.courseId;
        var gubayeId = req.params.gubayeId;
        course_ModelAccessor.addAttendanceColumn(req.body.newDate,req.body.remark,gubayeId, courseId, function(err, course){
            if(err)
            {
                next(err)
            }
            else
            {
                res.end();
                url = "/STB/SirateTimhert/course/Gubaye_Nius_Abal/"+courseId+"/"+gubayeId
                res.redirect(url)
                res.json(course)
            }
        })
    })    
    //for removing course : Deleting Course
        // What should happen when a course is removed or deleted?
    // For Department Admins
router.get('/DepartmentAdmin', mid.requireSignIn, mid.requiresToBeLeader,mid.updateUserData, function(req,res,next){
    classRoom_ModelAccessor.Gubaeyat(function(error,gubaeat){
      if(gubaeat.length != 0)
      {  
        req.session.user.gubaeat= gubaeat;
      }
      else
      {
        req.session.user.gubaeat= {};
      }
        course_ModelAccessor.allCourses((error,courses)=>{
            if(!error)
            {
                if(courses.length != 0)
                {
                    var courseIds = [];
                    courseIds.pop();
                    courses.map(singleCourse => {
                        courseIds.push(singleCourse._id);
                    });
                    course_ModelAccessor.courseDetailArray(courseIds,function(error,coursesArray){
                        if(error)
                        {
                            next(error)
                        }
                        else
                        {
                            curriculum_ModelAccessor.curriculumsSmallDetail(function(err,curriculums){
                                req.session.courses = coursesArray;
                                req.session.curriculums = curriculums;
                                return res.render("Workspaces/SierateTimhert/templates/SireateTDA.jade",req.session);    
                            })
                        }
                    });
                }
                else
                {
                    curriculum_ModelAccessor.curriculumsSmallDetail(function(err,curriculums){
                        req.session.courses = {};
                        if(curriculums.length != 0)
                        {
                            req.session.curriculums = curriculums;
                            return res.render("Workspaces/SierateTimhert/templates/SireateTDA.jade",req.session);    
                        }
                        else
                        {
                            req.session.curriculums = {};
                            return res.render("Workspaces/SierateTimhert/templates/SireateTDA.jade",req.session);    
                        }
                    })
                }
                    
            }
            });
    });
});
// For Sub Department Admins
router.get('/SubDepartmentAdmin', mid.requireSignIn,mid.updateUserData, mid.requiresToBeSTKNS,  function(req,res,next){
    classRoom_ModelAccessor.Gubaeyat(function(error,gubaeat){
        if(gubaeat.length != 0)
        {  
          req.session.user.gubaeat= gubaeat;
        }
        else
        {
          req.session.user.gubaeat= {};
        }
          course_ModelAccessor.allCourses((error,courses)=>{
              if(!error)
              {
                  if(courses.length != 0)
                  {
                      var courseIds = [];
                      courseIds.pop();
                      courses.map(singleCourse => {
                          courseIds.push(singleCourse._id);
                      });
                      course_ModelAccessor.courseDetailArray(courseIds,function(error,coursesArray){
                          if(error)
                          {
                              next(error)
                          }
                          else
                          {
                              curriculum_ModelAccessor.curriculumsSmallDetail(function(err,curriculums){
                                  req.session.courses = coursesArray;
                                  req.session.curriculums = curriculums;
                                  return res.render("Workspaces/SierateTimhert/templates/SireateTSDA.jade",req.session);    
                              })
                          }
                      });
                  }
                  else
                  {
                      curriculum_ModelAccessor.curriculumsSmallDetail(function(err,curriculums){
                          req.session.courses = {};
                          if(curriculums.length != 0)
                          {
                              req.session.curriculums = curriculums;
                              return res.render("Workspaces/SierateTimhert/templates/SireateTSDA.jade",req.session);    
                          }
                          else
                          {
                              req.session.curriculums = {};
                              return res.render("Workspaces/SierateTimhert/templates/SireateTSDA.jade",req.session);    
                          }
                      })
                  }
                      
              }
              });
      });
});
// For Sub Department Members
router.get('/SubDepartmentMember', mid.requireSignIn,mid.updateUserData, mid.requiresToBeSTKNA, function(req,res,next){
    classRoom_ModelAccessor.Gubaeyat(function(error,gubaeat){
        if(gubaeat.length != 0)
        {
            req.session.user.gubaeat= gubaeat;
        }
        else
        {
            req.session.user.gubaeat= {};
        }

        course_ModelAccessor.allCourses((error,courses)=>{
            if(courses.length != 0) req.session.courses = courses;
            else req.session.courses = {};
            
            curriculum_ModelAccessor.curriculumsSmallDetail(function(err,curriculums){   
                if(curriculums.length != 0) req.session.curriculums = curriculums;
                else req.session.curriculums = {};
                return res.render("Workspaces/SierateTimhert/templates/SireateTSDM.jade",req.session);
            });
            })
    });
});
// Curriculum Routes
// Public users
router.get('/curriculum/:curriculumId', mid.requireSignIn,mid.updateUserData, function(req,res,next){
    var curriculumId = req.params.curriculumId;
    curriculum_ModelAccessor.detailedCurriculumDetail(curriculumId,function(err, curriculum){
        if(err)
        {
            next(err)
        }
        else
        {
            UserModelAccessor.userData(curriculum.created_By,function(err,user){
                req.session.curriculum = curriculum;
                req.session.curriculum.created_By = user.name;
                // count courses
                curriculum_ModelAccessor.notAddedCoursesPerCurriculum(curriculumId, function(err, unregisteredCoursesPerGrade){
                    if(err)
                    {
                        next(err);
                    }
                    else
                    {
                        //use mongoose populate to pupulate course details on to each courses before sending it to 
                        //the front end                  
                        return res.render("Workspaces/SierateTimhert/templates/SierateTimhertpublic.jade",req.session)  
                    }
                })   
            });
        }
    })
});
// Department Admin
router.get('/DepartmentAdmin/curriculum/:curriculumId', mid.requireSignIn, mid.requiresToBeLeader, mid.updateUserData, function(req,res,next){
    var curriculumId = req.params.curriculumId;
    curriculum_ModelAccessor.detailedCurriculumDetail(curriculumId,function(err, curriculum){
        if(err)
        {
            next(err)
        }
        else
        {
            UserModelAccessor.userData(curriculum.created_By,function(err,user){
                req.session.curriculum = curriculum;
                req.session.curriculum.created_By = user.name;
                // count courses
                curriculum_ModelAccessor.notAddedCoursesPerCurriculum(curriculumId, function(err, unregisteredCoursesPerGrade){
                    if(err)
                    {
                        next(err);
                    }
                    else
                    {
                        //use mongoose populate to pupulate course details on to each courses before sending it to 
                        //the front end
                        req.session.unregisteredCoursesPerGrade = unregisteredCoursesPerGrade;                  
                        classRoom_ModelAccessor.Gubaeyat(function(err,classRooms){
                            curriculum.gubayeat.forEach(gubaye=>{
                                classRooms.forEach(classRoom=>{
                                    if(gubaye.id.toString() == classRoom._id.toString())
                                    {
                                        gubaye.name = classRoom.name;
                                    }
                                })
                            })
                            return res.render("Workspaces/SierateTimhert/templates/SierateTimhertTDA.jade",req.session)  
                        })
                    }
                })   
            });
        }
    })
});
// Sub Department Admin
router.get('/SubDepartmentAdmin/curriculum/:curriculumId', mid.requireSignIn, mid.requiresToBeSTKNS, mid.updateUserData, function(req,res,next){
    var curriculumId = req.params.curriculumId;
    curriculum_ModelAccessor.detailedCurriculumDetail(curriculumId,function(err, curriculum){
        if(err)
        {
            next(err)
        }
        else
        {
            UserModelAccessor.userData(curriculum.created_By,function(err,user){
                req.session.curriculum = curriculum;
                req.session.curriculum.created_By = user.name;
                // count courses
                curriculum_ModelAccessor.notAddedCoursesPerCurriculum(curriculumId, function(err, unregisteredCoursesPerGrade){
                    if(err)
                    {
                        next(err);
                    }
                    else
                    {
                        //use mongoose populate to pupulate course details on to each courses before sending it to 
                        //the front end
                        req.session.unregisteredCoursesPerGrade = unregisteredCoursesPerGrade;                  
                        classRoom_ModelAccessor.Gubaeyat(function(err,classRooms){
                            curriculum.gubayeat.forEach(gubaye=>{
                                classRooms.forEach(classRoom=>{
                                    if(gubaye.id.toString() == classRoom._id.toString())
                                    {
                                        gubaye.name = classRoom.name;
                                    }
                                })
                            })
                            return res.render("Workspaces/SierateTimhert/templates/SierateTimhertTSDA.jade",req.session)  
                        })
                    }
                })   
            });
        }
    })
});
// Sub Department Member
router.get('/SubDepartmentMember/curriculum/:curriculumId', mid.requireSignIn,mid.requiresToBeSTKNA, mid.updateUserData, function(req,res,next){
    var curriculumId = req.params.curriculumId;
    curriculum_ModelAccessor.detailedCurriculumDetail(curriculumId,function(err, curriculum){
        if(err)
        {
            next(err)
        }
        else
        {
            UserModelAccessor.userData(curriculum.created_By,function(err,user){
                req.session.curriculum = curriculum;
                req.session.curriculum.created_By = user.name;
                // count courses
                curriculum_ModelAccessor.notAddedCoursesPerCurriculum(curriculumId, function(err, unregisteredCoursesPerGrade){
                    if(err)
                    {
                        next(err);
                    }
                    else
                    {
                        //use mongoose populate to pupulate course details on to each courses before sending it to 
                        //the front end
                        req.session.unregisteredCoursesPerGrade = unregisteredCoursesPerGrade;                  
                        classRoom_ModelAccessor.Gubaeyat(function(err,classRooms){
                            curriculum.gubayeat.forEach(gubaye=>{
                                classRooms.forEach(classRoom=>{
                                    if(gubaye.id.toString() == classRoom._id.toString())
                                    {
                                        gubaye.name = classRoom.name;
                                    }
                                })
                            })
                            return res.render("Workspaces/SierateTimhert/templates/SierateTimhertTSDM.jade",req.session)  
                        })
                    }
                })   
            });
        }
    })
});
router.put('/curriculum/:curriculumId', mid.requireSignIn,mid.updateUserData, mid.requiresToBeSTKNS, function(req,res,next){
});
router.post('/curriculum',mid.requireSignIn,mid.updateUserData, mid.requiresToBeSTKNS, function(req,res,next){
    curriculum_ModelAccessor.createCurriculum(req.session.userId,req.body.name, req.body.description,function(err, curriculum){
            url = "../SirateTimhert/SubDepartmentAdmin";
            res.redirect(url)
    })
});
//  mid.requireSignIn, mid.updateUserData,mid.requiresToBeSTKNS,
router.post('/curriculum/:curriculum_id/grade/',mid.requireSignIn, function(req,res,next){
    var curriculum_id = req.params.curriculum_id;
    curriculum_ModelAccessor.createGrade(curriculum_id,req.body.created_By,req.body.gradeName, req.body.description,function(err,resp){
        if(err)
        {
            next(err);
        }
        else
        {
            curriculum_ModelAccessor.notAddedCoursesPerCurriculum(curriculum_id, function(err, response){
                var url="/STB/SirateTimhert/SubDepartmentAdmin/curriculum/" + curriculum_id;
                req.session.NAcourses = response;
                res.redirect(url);
            }) 
        }
    })
})
router.post('/curriculum/:curriculum_id/edit_grade/',mid.requireSignIn, function(req,res,next){
    curriculum_ModelAccessor.editGrade(req.params.curriculum_id, req.body.grade_id, req.body.gname, req.body.gdescription,function(err,resp){
        if(err)
        {
            next(err);
        }
        else
        {
            var url = '/STB/SirateTimhert/SubDepartmentAdmin/curriculum/'+req.params.curriculum_id;
            res.redirect(url);
        }
    })
})
router.post('/curriculum/:curriculum_id/:grade_id',mid.requireSignIn, function(req,res,next){
    curriculum_ModelAccessor.addCourse(req.params.curriculum_id,req.params.grade_id, req.body.course_id,function(err,response){
        if(err)
        {
            next(err);
        }
        else
        {
            res.json(response)
        }
    })
})
router.get('/curriculum/:curriculumId/:grade_id/:course_id',mid.requireSignIn,mid.updateUserData, function(req,res,next){
    curriculum_ModelAccessor.changeCourseStatus(req.params.curriculumId,req.params.grade_id,req.params.course_id,function(err,response){
        res.json(response);     
    })
});
router.delete('/curriculum/:curriculumId', mid.requireSignIn,mid.updateUserData, mid.requiresToBeSTKNS, function(req,res,next){
});
module.exports = router;