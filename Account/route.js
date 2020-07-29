var express = require('express');
var router = express.Router();
var IDD = "";
var PWD = require('./Models/PSDrecovery');
var User = require('./Models/user');
var app = express();
var mid = require('../SharedComponents/Middlewares/index');
var Message = require('../SharedComponents/Messaging/Message_model');
var socketmodel = require('../SharedComponents/Models/socket');
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/logout', function(req,res,next){
    if(req.session){
        //Destroy the session
        req.session.destroy(function(err){
            if(err){
                return next(err);
            } else{
                res.redirect('/');
            }
        });
    }
 });

router.post('/updateProfile', mid.requireSignIn, function(req,res,next){
    User.editProfile(req.session.userId, req.body, function(error, user){
        if(error){
            var err = new Error("Update failed!");
        }
        else{
            res.render('Account/templates/profile');
        }
    });
});

router.get('/register', mid.loggedOut, function(req,res,next){
    return res.render('Account/templates/register');
});

router.post('/register', function(req,res,next){
    if(req.body.tel && req.body.password && req.body.rpassword && req.body.name && req.body.email)
    {
        //Confirm that user typed same password twice
        if(req.body.password !== req.body.rpassword)
        {
            var err = new Error('Passwords do not match.');
            err.status = 400;
            return next(err);        
        }
        var userData = {
            telephone: req.body.tel,
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
        };
        var messageData = {
            userID: req.body.tel
        };

        // use schema's 'create' method to insert document into Mongo
        User.create(userData, function(error, user){
            if(error){
                return next(error);
            }
            else
            {
                req.session.userId = user._id;
                IDD = user._id;
                req.session.name = req.body.name;
                req.session.user = user;
                
                Message.create(messageData, function(error, MSG){
                    if(error){
                        return next(error);
                    }
                    else
                    {
                        return res.render('Account/templates/profile',user);
                    }
                    console.log(MSG);
                });
                
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

router.post('/login', function(req, res, next){
    if(req.body.tel && req.body.password)
    {
    User.authenticate(req.body.tel, req.body.password, function(error, user){
        if(error || !user){
            var err = new Error('Wrong telephone or password.');
            err.status = 401;
            return next(err);                
        } 
        else{
            req.session.userId = user._id;
            req.session.name = user.name;
            req.session.user = user;
            console.log("User login successfull");
            var socketData = {
                userID: user._id,
                socketId: "SOCKET_ID"
            };
        // use schema's 'create' method to insert document into Mongo
        socketmodel.create(socketData, function(error, ack){
            if(error){
                return next(error);
            }
            else
            {
                return res.render('Account/templates/profile',user);      
            }
        });
        }
    });
    }
    else
    {
        var err = new Error('Telephone Number and Password are required!');
        err.status = 401;
        return next(err);        
    }
});


router.get('/profile', mid.requireSignIn, function(req,res,next){
if(!req.session.userId){
    var err = new Error('You are not authorized to view this page');
    err.status = 403;
    return next(err);  
}
User.findById(req.session.userId)
    .exec(function (error,user){
        if (error){
            return next(error);
        } else {
            req.session.user  = (user);
            return res.render('Account/templates/profile',user);
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
        User.updatePassword(req.session.TUI, req.body.password, function(error, user){
            if(error){
                var err = new Error("Update failed!");
            }
            else{
                res.json(user);
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
router.post('/forgotPassword', function(req,res,next){
        if(req.body.tel)
        {
         User.IDentifyUserName(req.body.tel, function(error, user){
            if(error || !user){
                var err = new Error('Wrong telephone or password.');
                err.status = 401;
                return next(err);                
            } 
            else{
                req.session.TUI = user._id;
                req.session.NM = user.name;
                return res.render('Account/templates/EmailVerification', user);
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
    var PWDData = {
        uID: req.session.TUI,
        verificationCode: generateRandomNumber() 

    };
    console.log(PWDData);
    PWD.create(PWDData, function(error, pwd){
        if(error){
            return next(error);
        }
        else
        {
            console.log(pwd);
        }
    });
    PWD.verifyIdentity(req.session.TUI,req.body.vcode, function(error,response){

        if(error || !response){
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

module.exports = router;