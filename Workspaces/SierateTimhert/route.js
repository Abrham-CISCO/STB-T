var express = require('express');
var router = express.Router();
var mid = require('../../SharedComponents/Middlewares/index');
var classRoom_ModelAccessor = require('./models/classRoom_ModelAcessor');
var GubayeLink = "Workspaces/SierateTimhert/templates/Gubaye.jade"
var UserModelAccessor = require('../../Account/Models/user_model_accessor');
var classRoomInd_ModelAccessor = require('./models/classRoomInd_ModelAccessor');
var multer = require('multer')
var course_ModelAccessor = require('./models/courseModelAccessor');
const course = require('./models/course');

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

        res.end();
        // const updateGubaye = (ClassRoomID, gubayeName, Description, leader, callback) => {    
    })
    router.get('/Gubaye/public/:GubayeID',function(req,res,next){
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
                            classRoom_ModelAccessor.notAddedCourses(GubayeID,function(error, unjoinedCourses, JoinedClass){
                                req.session.unjoinedCourses = unjoinedCourses
                                req.session.JoinedClass = JoinedClass;
                                req.session.user.allusers = users;
                                return res.render("Workspaces/SierateTimhert/templates/Gubaye.jade",req.session)
                            })
                        })

                    })

                })
    });
    router.post('/Gubaye/New', function(req,res,next){
        classRoom_ModelAccessor.createGubaye(req.body.gname,"No Description.", function(error,gubaye){
            if(error)
            {
                return res.end("Error!")     
            }
            res.end("Gubaye Created");
        })
    });
    router.get('/Gubaye_Sebsabi/:GubayeID', mid.requiresToBeLeader, mid.updateUserData, function(req,res,next){
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
                            classRoom_ModelAccessor.notAddedCourses(GubayeID,function(error, unjoinedCourses, JoinedClass){
                                req.session.unjoinedCourses = unjoinedCourses
                                req.session.JoinedClass = JoinedClass;
                                req.session.user.allusers = users;
                                return res.render("Workspaces/SierateTimhert/templates/GubayeTDA.jade",req.session)
                            })
                        })

                    })

                })
    });
    router.get('/Gubaye_Nius_Sebsabi/:GubayeID/Remove/:telephone', mid.requiresToBeSTKNS,mid.updateUserData, function(req,res,next){
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
    router.get('/Gubaye_Nius_Abal/:GubayeID/MRemove/:telephone', mid.requiresToBeSTKNA,mid.updateUserData, function(req,res,next){
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
    router.get('/Gubaye_Nius_Sebsabi/:GubayeID', mid.requiresToBeSTKNS,mid.updateUserData, function(req,res,next){
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
                                    }
                                    req.session.user.allusers = users;
                                    course_ModelAccessor.allCourses((error,courses)=>{
                                        req.session.courses = courses
                                        // return res.render("Workspaces/SierateTimhert/templates/courseTSDA.jade",req.session)
                                        classRoom_ModelAccessor.notAddedCourses(GubayeID,function(error, unjoinedCourses, JoinedCourses){
                                            req.session.unjoinedCourses = unjoinedCourses
                                            req.session.JoinedCourses = JoinedCourses;
                                            return res.render("Workspaces/SierateTimhert/templates/GubayeTSDA.jade",req.session)
                                        })
                                    })
                                })
                        })
                    })
                })
    });
    router.post('/Gubaye_Nius_Sebsabi/upload/:courseId/courseoutline', mid.requiresToBeSTKNS,mid.updateUserData,
     upload.single('courseOutlineFile'), function(req,res,next){
         var courseId = req.params.courseId;
        course_ModelAccessor.courseDetail(courseId,function(error, singleCourse){
            singleCourse.courseOutline = "http://localhost:3000/Workspaces/SierateTimhert/static/" + req.file.originalname
            course_ModelAccessor.editCourse(courseId,{courseOutline:singleCourse.courseOutline},function(error,confirmation){
                if(error)
                {
                    next(error)
                }
                else
                {
                    var url="http://localhost:3000/SirateTimhert/course/nius_sebsabi/"+courseId
                    res.redirect(url) 
                }
            })
        })

    });
    router.post('/Gubaye_Nius_Sebsabi/upload/:courseId/book', mid.requiresToBeSTKNS,mid.updateUserData,
    upload.single('bookFile'), function(req,res,next){
        var courseId = req.params.courseId;
        course_ModelAccessor.courseDetail(courseId,function(error,singleCourse){
            singleCourse.books.push({bookName:"NONE",filePath:req.file.originalname})
            course_ModelAccessor.editCourse(courseId,{books:singleCourse.books},function(error,confirmation){
                if(error)
                {
                    
                    // res.json(books)
                    next(error)
                }
                else
                {
                    var url="http://localhost:3000/SirateTimhert/course/nius_sebsabi/"+courseId
                    console.log(confirmation)
                    
                    res.json(confirmation)
                    // res.redirect(url) 
                }
            })
        })
    });
    router.post('/Gubaye_Nius_Sebsabi/course/new',function(req,res,next){
        course_ModelAccessor.createCourse(req.body.name, req.body.description,req.user._id,(error, newCourse)=>{
          if(error)
          {
            res.json(error);    
          }
          else
          {
              res.redirect('/SirateTimhert/SubDepartmentAdmin')
          }
          
        })
    });
    router.get('/Gubaye_Nius_Abal/:GubayeID', mid.requiresToBeSTKNA,mid.updateUserData, function(req,res,next){
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
                                    }
                                    req.session.user.allusers = users;
                                    classRoom_ModelAccessor.notAddedCourses(GubayeID,function(error, unjoinedCourses, JoinedClass){
                                        req.session.unjoinedCourses = unjoinedCourses
                                        console.log("JoinedClass ",JoinedClass)
                                        req.session.JoinedClass = JoinedClass;
                                    return res.render("Workspaces/SierateTimhert/templates/GubayeTSDM.jade",req.session)
                                    })
                                })
                        })

                    })

                })
    });
//  For courses
    router.get('/course/public/:courseId', function(req,res,next){
        return res.render("Workspaces/SierateTimhert/templates/course.jade",req.session)
    })
    router.get('/course/sebsabi/:courseId',mid.requiresToBeLeader,mid.updateUserData, function(req,res,next){
        course_ModelAccessor.courseDetail(req.params.courseId,function(error, returnedCourse)
        {
            if(error)
            {
                next(error)
            }
            else
            {
                console.log("returnedCourse",returnedCourse)
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
                                    console.log(gubayeNameArr)
                                    return res.render("Workspaces/SierateTimhert/templates/courseTDA.jade",req.session)                    
                                })
                            }
                        })

                })
            }
        });
    })
    router.get('/course/sebsabi/:courseId/:gubayeId',mid.requiresToBeLeader,mid.updateUserData, function(req,res,next){
        course_ModelAccessor.courseDetail(req.params.courseId,function(error, returnedCourse)
        { 
            if(error)
            {
                next(error)
            }
            else
            {
                console.log("returnedCourse",returnedCourse.markList.sort((b,a)=> {
                    var aColumn = (a.column_1_value + a.column_2_value + a.column_3_value + a.column_4_value + a.column_5_value
                        + a.column_6_value + a.column_7_value + a.column_8_value + a.column_9_value + a.column_10_value);
                    var bColumn = (b.column_1_value + b.column_2_value + b.column_3_value + b.column_4_value + b.column_5_value
                        + b.column_6_value + b.column_7_value + b.column_8_value + b.column_9_value + b.column_10_value);

                    return aColumn - bColumn
                }))
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
                                    console.log(returnedCourse)
                                    req.session.returnedCourse.createdBy = user.name;
                                    classRoom_ModelAccessor.gubayeDetail(req.params.gubayeId, function(error,classRoom){
                                        req.session.classRoom = classRoom;
                                        console.log("returnedCourse.attendance",returnedCourse.attendance)
                                        return res.render("Workspaces/SierateTimhert/templates/courseClassRoomTDA.jade",req.session)                    
                                    })
                                })                          
                })
            }
        });
    })
    router.get('/course/Gubaye_Nius_Sebsabi/:courseId/:gubayeId',mid.requiresToBeSTKNS,mid.updateUserData, function(req,res,next){
        course_ModelAccessor.courseDetail(req.params.courseId,function(error, returnedCourse)
        { 
            if(error)
            {
                next(error)
            }
            else
            {
                console.log("returnedCourse",returnedCourse.markList.sort((b,a)=> {
                    var aColumn = (a.column_1_value + a.column_2_value + a.column_3_value + a.column_4_value + a.column_5_value
                        + a.column_6_value + a.column_7_value + a.column_8_value + a.column_9_value + a.column_10_value);
                    var bColumn = (b.column_1_value + b.column_2_value + b.column_3_value + b.column_4_value + b.column_5_value
                        + b.column_6_value + b.column_7_value + b.column_8_value + b.column_9_value + b.column_10_value);

                    return aColumn - bColumn
                }))
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
                                    console.log(returnedCourse)
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
    router.get('/course/Gubaye_Nius_Abal/:courseId/:gubayeId',mid.requiresToBeSTKNA,mid.updateUserData, function(req,res,next){
        course_ModelAccessor.courseDetail(req.params.courseId,function(error, returnedCourse)
        { 
            if(error)
            {
                next(error)
            }
            else
            {
                console.log("returnedCourse",returnedCourse.markList.sort((b,a)=> {
                    var aColumn = (a.column_1_value + a.column_2_value + a.column_3_value + a.column_4_value + a.column_5_value
                        + a.column_6_value + a.column_7_value + a.column_8_value + a.column_9_value + a.column_10_value);
                    var bColumn = (b.column_1_value + b.column_2_value + b.column_3_value + b.column_4_value + b.column_5_value
                        + b.column_6_value + b.column_7_value + b.column_8_value + b.column_9_value + b.column_10_value);

                    return aColumn - bColumn
                }))
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
                                    console.log(returnedCourse)
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
    router.get('/course/public/:courseId/:gubayeId', function(req,res,next){
        course_ModelAccessor.courseDetail(req.params.courseId,function(error, returnedCourse)
        { 
            if(error)
            {
                next(error)
            }
            else
            {
                console.log("returnedCourse",returnedCourse)
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
    router.get('/course/nius_sebsabi/:courseId',mid.requiresToBeSTKNS,mid.updateUserData, function(req,res,next){
        course_ModelAccessor.courseDetail(req.params.courseId,function(error, returnedCourse)
        {
            if(error)
            {
                next(error)
            }
            else
            {
                console.log("returnedCourse",returnedCourse)
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
                                    console.log(gubayeNameArr)
                                    return res.render("Workspaces/SierateTimhert/templates/courseTSDA.jade",req.session)                    
                                })
                            }
                        })

                })
            }
        });
    })
    router.get('/course/remove/:courseID/:gubayeId',mid.requiresToBeSTKNS,mid.updateUserData, function(req,res,next){
        var courseId = req.params.courseID;
        var gubayeId = req.params.gubayeId;
        classRoom_ModelAccessor.removeCourse(courseId,gubayeId,function(error,notification)
        {
            if(error)
            {
                console.log(error);
            }
            else
            {
                var url = '/SirateTimhert/Gubaye_Nius_Sebsabi/'+gubayeId;
                res.redirect(url);
            }
        })

    })
    router.post('/course/:courseId/:gubayeId/attendance', function(req,res,next){
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
                url = "http://localhost:3000/SirateTimhert/course/Gubaye_Nius_Sebsabi/"+courseId+"/"+gubayeId
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
        req.session.user.gubaeat= gubaeat;
        course_ModelAccessor.allCourses((error,courses)=>{
            req.session.courses = courses;
                    return res.render("Workspaces/SierateTimhert/templates/SireateTDA.jade",req.session);
        });
    });
});

// For Sub Department Admins
router.get('/SubDepartmentAdmin', mid.requireSignIn,mid.updateUserData,  function(req,res,next){
    classRoom_ModelAccessor.Gubaeyat(function(error,gubaeat){
        req.session.user.gubaeat= gubaeat;
        course_ModelAccessor.allCourses((error,courses)=>{
            req.session.courses = courses;
            return res.render("Workspaces/SierateTimhert/templates/SireateTSDA.jade",req.session);
        });
    });
});

// For Sub Department Members
router.get('/SubDepartmentMember', mid.requireSignIn,mid.updateUserData, function(req,res,next){
    classRoom_ModelAccessor.Gubaeyat(function(error,gubaeat){
        req.session.user.gubaeat= gubaeat;
        course_ModelAccessor.allCourses((error,courses)=>{
            req.session.courses = courses;
            return res.render("Workspaces/SierateTimhert/templates/SireateTSDM.jade",req.session);
        })
    });
});

module.exports = router;