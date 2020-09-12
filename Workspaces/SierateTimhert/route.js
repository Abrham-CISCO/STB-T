var express = require('express');
var router = express.Router();
var mid = require('../../SharedComponents/Middlewares/index');
var subDepartment = "SierateTimhert";
var filePrefix = "SireateT";
var classRoom_ModelAccessor = require('./models/classRoom_ModelAcessor');
var DepartmentAdminLink = "Workspaces/SierateTimhert/templates/SireateTDA";
var SubDepartmentAdminLink = "Workspaces/"+subDepartment+"/templates/"+ filePrefix+"SDA";
var SubDepartmentMemberLink="Workspaces/"+subDepartment+"/templates/"+ filePrefix+"SDM";
var GubayeLink = "Workspaces/SierateTimhert/templates/Gubaye.jade"
var UserModelAccessor = require('../../Account/Models/user_model_accessor');
var classRoomInd_ModelAccessor = require('./models/classRoomInd_ModelAccessor');

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
        
        return res.render(GubayeLink,req.session.user)
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
                            return res.render("Workspaces/SierateTimhert/templates/GubayeTDA.jade",req.session.user)
                        })

                    })

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
                                    return res.render("Workspaces/SierateTimhert/templates/GubayeTSDA.jade",req.session.user)
                                })
                        })

                    })

                })
    });
// For Department Admins
router.get('/DepartmentAdmin', mid.requireSignIn, mid.requiresToBeLeader, function(req,res,next){
    classRoom_ModelAccessor.Gubaeyat(function(error,gubaeat){
        req.session.user.gubaeat= gubaeat;
        console.log(req.session.user.gubaeat);
        return res.render("Workspaces/SierateTimhert/templates/SireateTDA.jade",req.session.user);
    });
});

// For Sub Department Admins
router.get('/SubDepartmentAdmin', mid.requireSignIn,  function(req,res,next){
    classRoom_ModelAccessor.Gubaeyat(function(error,gubaeat){
        req.session.user.gubaeat= gubaeat;
        console.log(req.session.user.gubaeat);
        return res.render("Workspaces/SierateTimhert/templates/SireateTSDA.jade",req.session.user);
    });
});

// For Sub Department Members
router.get('/SubDepartmentMember', mid.requireSignIn, function(req,res,next){
    return res.render(SubDepartmentMemberLink,req.session.user);
});

module.exports = router;