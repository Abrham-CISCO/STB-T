var classRoom_ModelAccessor = require('../../Workspaces/SierateTimhert/models/classRoom_ModelAcessor')
var classRoomInd_ModelAccessor = require('../../Workspaces/SierateTimhert/models/classRoomInd_ModelAccessor')
var user_ModelAccessor = require('../../Account/Models/user_model_accessor')
function loggedOut(req, res, next){
    console.log(req.session && req.session.userId);
    if(req.session.userId){
        return res.redirect('../Accounts/home');
    }
    return next();
}


function requireSignIn(req, res, next){
    console.log(req.session);
    if(req.session.userId){
        return next();
    }
    else
    {
        var err = new Error('You must login first to access this page!');
        err.status = 401;
        return next(err);        
    }
}

function ValidateSigninForm(req,res, next){
    if(req.body.telephone && req.body.password)
    {
        return next();
    }        
    else
    {
        var err = new Error('Telephone Number and Password are required!');
        err.status = 401;
        return next(err);        
    }
}
function requiresToBeSTKNS(req,res,next){
    if(req.session.user.work[0].subDepartment[2].active){
        return next()
    }
    else
    {
        var err = new Error('ይህን ገጽ ለማየት እና ተጠቃሚ ለመሆን የስርዕእተ ትምህርት ክፍል ሰብሳቢ መሆን አለቦት!');
        err.status = 401;
        return next(err);                
    }
}

function requiresToBeSTKNA(req,res,next){
    if(req.session.user.work[0].subDepartment[3].active){
        return next()
    }
    else
    {
        var err = new Error('ይህን ገጽ ለማየት እና ተጠቃሚ ለመሆን የስርዕእተ ትምህርት ክፍል አባል መሆን አለቦት!');
        err.status = 401;
        return next(err);                
    }
}

function requiresToBeLeader(req, res, next){
    if(req.session.user.work[0].subDepartment[0].active){
        return next();
    }
    else
    {
        var err = new Error('ይህን ገጽ ለማየት አመራር መሆን አለቦት!');
        err.status = 401;
        return next(err);        
    }
}
function updateUserData(req, res, next){
    var gubaeat = [];
    gubaeat.pop();
    classRoomInd_ModelAccessor.joinedClass(req.session.user.telephone,function(error,gubaeats)
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
                        user_ModelAccessor.userDataByTel(req.session.user.telephone,function(err,user){
                            req.session.user.work = user.work
                        })
                        req.session.user.classRoom.pop();
                        req.session.JoinedclassRooms = (gubayeSmall);
                        return next();    
                    }
                
            })
        }
        else{
            user_ModelAccessor.userDataByTel(req.session.user.telephone,function(err,user){
                req.session.user.work = user.work
            })
            return next();    
        }
    })
}
module.exports.loggedOut = loggedOut;
module.exports.requireSignIn = requireSignIn;
module.exports.requiresToBeLeader = requiresToBeLeader;
module.exports.requiresToBeSTKNS = requiresToBeSTKNS;
module.exports.ValidateSigninForm = ValidateSigninForm;
module.exports.requiresToBeSTKNA = requiresToBeSTKNA;
module.exports.updateUserData = updateUserData;