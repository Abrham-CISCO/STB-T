function loggedOut(req, res, next){
    console.log(req.session && req.session.userId);
    if(req.session.userId){
        return res.redirect('../Accounts/profile');
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
module.exports.loggedOut = loggedOut;
module.exports.requireSignIn = requireSignIn;
module.exports.requiresToBeLeader = requiresToBeLeader;