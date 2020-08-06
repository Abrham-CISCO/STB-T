var mongoose = require('mongoose')
var NotificationSchema = new mongoose.Schema({
    body:{
        type:String,
        required:true
    },
    nImage:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        required:true
    },
    nDate: Date.now()
})
var UserSchema = new mongoose.Schema ({
    // for each user a notification document will be prepared.
    // All notifications concernning that user will be put on the document
    // The notification is then loaded from this document and it is displayed on the user's notification list

    userTel: {
        type:String,
        unique: true
    },
    Notifications: [NotificationSchema]
})
// Required functions
// 1. a function that loads notification object of a selected user
// 2. a function that writes notifiaction on selected user's notification document
NotificationSchema.statics.LoadNotifications = function(telephone,callback){

}
NotificationSchema.statics.AddNotification = function(telephone, NotificationObject, callback){

}


var Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification