var PWD = require('./PSDrecovery');
var User = require('../Models/user');
var ModelAccessor = require('../../SharedComponents/Messaging/model_Accessor');

const userData = (userId, callback) => {
    User.UserById(userId,function(error,user){
        if(error || !user)
        {
            if(error)
            {
                callback(error,null);
            }
            if(!user)
            {
                var err = new Error("User Not Found");
                err.status = 401;
                err.message = "User Not Found";
                callback(err,null);
            }
        }
        else
        {
            callback(null,user);
        }
    });
}

const userDataByTel = (userTel, callback) => {
    User.IDentifyUserName(userTel,function(error,user){
        if(error || !user)
        {
            if(error)
            {
                callback(error,null);
            }
            if(!user)
            {
                var err = new Error("User Not Found");
                err.status = 401;
                err.message = "User Not Found";
                callback(err,null);
            }
        }
        else
        {
            callback(null,user);
        }
    });
}

const updateProfile =  (userId, changeObject,callback) =>{
    User.editProfile(userId, changeObject, function(error, user){
        if(error){
            var err = new Error("Update failed!");
            callback(err,null);
        }
        else{
            userData(userId,function(error,user){
                callback(null,user);
            });
        }
    });
}

const register = (userData,messageData,callback) =>{
    User.create(userData, function(error, user){
        if(error){
            callback(error,null);
        }
        else
        {
            ModelAccessor.createAccount(messageData,function(err,msg){
                callback(null,user);
            });                
        }
    });
};

const Autenticate = (tel,password,callback) => {
    User.authenticate(tel, password, function(error, user){
        if(error || !user)
        {
            if(error)
            {
                callback(error,null);
            }
            if(!user)
            {
                var err = new Error('Wrong telephone or password.');
                err.status = 401;
                err.message = "Wrong telephone or password.";
                callback(err,null);
            }
        } 
        else
        {
            callback(null,user);
        }
    });
}

const updatePassword = (TUI,password,callback) => {
        User.updatePassword(TUI, password, function(error, notification){
            if(error){
                var err = new Error("Update failed!");
                callback(err,null);
            }
            else{
                callback(null,notification)
            }
        });
}

exports.userData = userData;
exports.updateProfile = updateProfile; 
exports.register = register;
exports.Autenticate = Autenticate;
exports.updatePassword = updatePassword;
exports.userDataByTel = userDataByTel;