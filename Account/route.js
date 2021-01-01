var express = require('express');
var router = express.Router();
var PWD = require('./Models/PSDrecovery');
// var User = require('./Models/user');
var app = express();
var mid = require('../SharedComponents/Middlewares/index');
var messaging = require('../SharedComponents/Messaging/route');
var classRoomInd_ModelAccessor = require('../Workspaces/SierateTimhert/models/classRoomInd_ModelAccessor')
var ModelAccessor = require('../SharedComponents/Messaging/model_Accessor');
var Course_ModelAccessor = require('../Workspaces/SierateTimhert/models/courseModelAccessor')
var classRoom_ModelAccessor = require('../Workspaces/SierateTimhert/models/classRoom_ModelAcessor')
var UserModelAccessor = require('./Models/user_model_accessor')
var PWDModelAccessor = require('./Models/psd_model_accessor');
// var MessagesM = require('../SharedComponents/Models/Message_model');
var socketmodel = require('../SharedComponents/Models/socket');
var passport = require('passport')
var authenticate = require('./authenticate');
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/logout', function(req,res,next){
    if(req.session){
        //Destroy the session
        req.session.destroy(function(err){
            if(err){
                return next(err);
            } else{
                res.clearCookie('session-id');
                res.redirect('/');
            }
        });
    }
 });

 router.get('/All', function(req,res,next){
    UserModelAccessor.allUsers(function(error,Users){
        res.json({
            response:Users
        })
    })
 });

 router.get('/Info/:userId',function(req,res,next){
     var UserId = req.params.userId
     UserModelAccessor.userData(UserId,function(error,user){
         if(error){
            res.json({
                response:error
            })
         }
         else
         {
             res.json({
                 response:user
             })
         }
     });
 });

 router.get('/MyInfo/',function(req,res,next){
    var UserId = req.session.userId;
    UserModelAccessor.userData(UserId,function(error,user){
        if(error){
            next(error);
        }
        else
        {
            res.json({
                user
            })
        }
    });
});


router.post('/updateProfile', mid.requireSignIn, function(req,res,next){
    UserModelAccessor.updateProfile(req.session.userId,req.body,function(error,user){
        if(error){
            var err = new Error("Update failed!");
        }
        else
        {
            req.session.user = user;
            res.render('Account/templates/profile',req.session);
        }
    });
});

router.get('/register', mid.loggedOut, function(req,res,next){
    return res.render('Account/templates/register');
});

router.get('/dashboard_detail/:tab', mid.requireSignIn, function(req,res,next){
    var tab = req.params.tab;
    // for students
    UserModelAccessor.allUsers(function(err,users){
        Course_ModelAccessor.allCoursesWithDetails(function(err,courses){
            classRoom_ModelAccessor.Gubaeyat(function(err,classRooms){
                UserModelAccessor.listOfTKMembers(function(err,members){
                    if(tab == "students" || tab == "courses" || tab == "groups" || tab == "members")
                    {
                        req.session.tab = tab
                        req.session.dashUsers = users
                        req.session.dashCourses = courses
                        req.session.dashClassRooms = classRooms
                        req.session.dashMembers = members
                        return res.render('Account/templates/dashBoard',req.session);
                    }
                    else
                    {
                        req.session.tab = "students"
                        req.session.dashUsers = users
                        req.session.dashCourses = courses
                        req.session.dashClassRooms = classRooms
                        req.session.dashMembers = members
                        return res.render('Account/templates/dashBoard',req.session);
                    }
                })
            })
        })
    })

});

router.post('/register', function(req,res,next){
    // Check All fields
    if(req.body.telephone && req.body.password && 
        req.body.rpassword && req.body.name
        && req.body.cname && req.body.sex && req.body.email)
    {
        //Confirm that user typed same password twice
        if(req.body.password !== req.body.rpassword)
        {
            var err = new Error('Passwords do not match.');
            err.status = 400;
            return next(err);        
        }
        var sexObject = {male:true, female:false}
        if(req.body.sex == "ሴት")
        {
            sexObject = {male:false, female:true}
        }
        var userData = {
            telephone: req.body.telephone,
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            cname: req.body.cname,
            sex: sexObject
        };
        var messageData = {
            userID: req.body.tel
        };
        
        UserModelAccessor.registerNewUser(userData,messageData,function(error,user){
            if(error)
            {
                return next(err);  
            }
            else
            {  
                passport.authenticate('local',{failureRedirect: "/accounts/login"})(req, res, () => {
                    req.session.userId = user._id;
                    req.session.name = req.body.name;
                    req.session.user = user;
                    return res.render('Account/templates/home',req.session);
                })
            }
        });
        // use schema's 'create' method to insert document into Mongo
    }
    else
    {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

router.get('/login',mid.loggedOut, function(req,res,next){
    return res.render('Account/templates/signin');
});

router.get('/login/Error',mid.loggedOut, function(req,res,next){
    return res.render('Account/templates/signinError');
});

router.post('/login', mid.ValidateSigninForm, mid.loggedOut, passport.authenticate('local',{failureRedirect:"login/Error"}), function(req, res, next){
    req.session.userId = req.user._id;
    req.session.name = req.user.name;
    req.session.user = req.user;
    // grant the user a JSON Web token
    var token = authenticate.getToken({_id:req.user._id})
    var gubaeat = [];
    gubaeat.pop();
    classRoomInd_ModelAccessor.joinedClass(req.body.telephone,function(error,gubaeats)
    {
        if(!(gubaeats.length == 0))
        {
            for(var i = 0; i<gubaeats.length; i++)
            {
                gubaeat.push(gubaeats[i].classID);
            }
            classRoom_ModelAccessor.IDArrayToNameArray(gubaeat,function(error,gubaeatName){
                    var gubayeSmall = []; 
                    gubayeSmall.pop();
                    for(var j=0; j<gubaeats.length; j++){
                        if(gubaeatName[j])
                        {
                        gubayeSmall.push({name:gubaeatName[j].name, id:gubaeats[j].classID});
                        }
                    }
                    if(!error && gubaeatName)
                    {
                        req.session.user.classRoom.pop();
                        req.session.JoinedclassRooms = (gubayeSmall);
                        return res.render('Account/templates/home',req.session);    
                    }
                
            })
        }
        else{
            return res.render('Account/templates/home',req.session);    
        }
    })
});

router.get('/profile', mid.requireSignIn, function(req,res,next){
if(!req.session.userId){
    var err = new Error('You are not authorized to view this page');
    err.status = 403;
    return next(err);  
}

UserModelAccessor.userData(req.session.userId, function(error,user){
    if (error){
        return next(error);
    } else {
        req.session.user  = (user);
        return res.render('Account/templates/profile',req.session);
    }
});
});

router.get('/home', mid.requireSignIn, function(req,res,next){
    if(!req.session.userId){
        var err = new Error('You are not authorized to view this page');
        err.status = 403;
        return next(err);  
    }
    UserModelAccessor.userData(req.session.userId, function(error,user){
        if (error){
            return next(error);
        } else {
            UserModelAccessor.allUsers(function(error,usersCount){                
                req.session.user  = (user);
                req.session.usersCount = usersCount.length
                Course_ModelAccessor.allCourses(function(err,courses){
                    req.session.coursesCount = courses.length
                    classRoom_ModelAccessor.Gubaeyat(function(err,gubayeats){
                        req.session.classRoomCount = gubayeats.length
                        UserModelAccessor.countOfTKMembers(function(err,countOfTKMembers){                            req.session.classRoomCount = gubayeats.length
                            req.session.countOfTKMembers = countOfTKMembers
                            return res.render('Account/templates/home',req.session);
                        })
                    })
                })
            })

        }
    });
    });

router.get('/public/profile/:telephone', function(req,res,next){
    var Tel = req.params.telephone;    

    UserModelAccessor.profileLoaderByTel(Tel,req.session.user, function(error,user, askerObject){
        var resultObject = {}
        resultObject.loaderuser = askerObject
        resultObject.loaderuser.JoinedclassRooms = req.session.JoinedclassRooms
        resultObject.loadeduser = user
        if (error){
            return next(error);
        } else {

            return res.render('Account/templates/profile_pub',resultObject);
        }
    });
});

router.get('/forgotPassword', function(req,res,next){
    return res.render('Account/templates/forgot-password');
});

//check if the accepted password matches the retyped password.
router.post('/CHPWD', function(req,res,next){
    if(req.body.password == req.body.passwordagain)
    {
    UserModelAccessor.updatePassword(req.session.TUI,req.body.password,function(error,notification){
        if(error){
            var err = new Error("Password Update failed!");
            return next(err);
        }
        else{
            res.json(notification);
        }
    });
    }
    else
    {
        var err = new Error('Passwords do not match!');
        err.status = 401;
        return next(err);        
    }     
});

router.get('/User', function(req,res,next){
    var telephoneArray = ["0923276844","0911675507"];
    UserModelAccessor.userObjectByTel(telephoneArray,function(error,users){
        res.json(users);
    })
});

router.post('/forgotPassword', function(req,res,next){
        if(req.body.tel)
        {
            UserModelAccessor.userDataByTel(req.body.tel,function(error,user){
                if(error || !user){
                    var err = new Error('Wrong telephone or password.');
                    err.message = "Wrong telephone or password"
                    err.status = 401;
                    return next(err);                
                } 
                else{
                    req.session.TUI = user._id;
                    req.session.NM = user.name;
                    var PWDData = {
                        uID: req.session.TUI,
                        verificationCode: generateRandomNumber() 
                
                    };
                    PWDModelAccessor.register(PWDData,function(error,user){
                        if(error){
                            return next(error);
                        }
                        else
                        {
                            return res.render('Account/templates/EmailVerification', user);
                        }
                    });
                }
            });
        }
        else
        {
            var err = new Error('Telephone Number is required!');
            err.status = 401;
            return next(err);        
        }     
});

router.post('/Iverify',function(req,res,next){
    PWDModelAccessor.verify(req.session.TUI,req.body.vcode,function(error,response){
        if(!response){
            var err = new Error('No response Recieved.');
            err.status = 401;
            return next(err);                
        }
        else if(error) 
        {
            var err = new Error('An Error has occured!');
            err.status = 401;
            return next(err);                
        } 
            return res.render('Account/templates/recover-password',{name:req.session.NM});
    });
});

router.get('/recoverPassword', function(req,res,next){
    return res.render('Pages/Accounts/recover-password', user);
});

generateRandomNumber = function()
{
    return (Math.floor(Math.random()*1000000) + 1 );
}

router.get('/add/:subDepartment/:role/:userTelephone', function(req,res,next){
    var subDepartment = req.params.subDepartment;
    var role = req.params.role;
    var userTelephone = req.params.userTelephone;

    UserModelAccessor.addMemberToSubDepartment(userTelephone,subDepartment,role, function(err){
        res.send("Done. Member Successfully Assigned")
    })
});

router.get('/remove/:subDepartment/:role/:userTelephone', function(req,res,next){
    var subDepartment = req.params.subDepartment;
    var role = req.params.role;
    var userTelephone = req.params.userTelephone;

    UserModelAccessor.removeMemberFromSubDepartment(userTelephone,subDepartment,role, function(err){
        res.send("Done. Member Successfully Removed")
    })
});

module.exports = router;