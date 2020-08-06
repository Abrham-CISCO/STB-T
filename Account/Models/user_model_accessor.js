var PWD = require('./PSDrecovery');
var User = require('../Models/user');
var ModelAccessor = require('../../SharedComponents/Messaging/model_Accessor');
var NotificatonAccessor = require('../../SharedComponents/Notification/model_Accessor')
// Write a function which accepts an array of telephone numbers and returns an array of objects that
// contain detail informations. the detail informations are id,name,pro_img,telephone

const userObjectByTel = (telephoneArray,callback) =>
{
        User.UserObjByTelephone(telephoneArray,function(error,user){
            callback(null,user)            
        })
}
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
                NotificatonAccessor.createNotification(userData.telephone,function(error,notification){
                    callback(null,user);
                });
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

// Chat Socket ID Setter and Getter
const getChatSocket = (telephone,callback) =>{
    User.getChatSocketID(telephone,function(error,ChatSocketID){
        if(error){
            var err = new Error("Error!");
            callback(err,null);
        }
        else{
            callback(null,ChatSocketID)
        }
    })
}


const setChatSocket = (telephone,socketID,callback) => {
    User.setChatSocketID(telephone,socketID, function(error,notification){
        if(error){
            var err = new Error("Update failed!");
            callback(err,null);
        }
        else{
            callback(null,notification)
        }
    })
}

exports.setChatSocket = setChatSocket;
exports.getChatSocket = getChatSocket;
exports.userData = userData;
exports.updateProfile = updateProfile; 
exports.register = register;
exports.Autenticate = Autenticate;
exports.updatePassword = updatePassword;
exports.userDataByTel = userDataByTel;
exports.userObjectByTel = userObjectByTel;