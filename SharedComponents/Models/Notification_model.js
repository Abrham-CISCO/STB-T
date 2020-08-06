var mongoose = require('mongoose')
var NotificationSchema = new mongoose.Schema ({
    // for each user a notification document will be prepared.
    // All notifications concernning that user will be put on the document
    // The notification is then loaded from this document and it is displayed on the user's notification list

    userTel: {
        type:String,
        unique: true
    },
    Notifications: {
        type: Object,
        default: [
            {
                body:"You have some new notification",
                nImage:"../SharedComponents/static/logo.jpg",
                tag:"personal",
                nDate: Date.now()
            }
        ]
    }
})
// Required functions
// 1. a function that loads notification object of a selected user
// 2. a function that writes notifiaction on selected user's notification document
NotificationSchema.statics.LoadNotifications = function(telephone,callback){
    Notification.findOne({userTel:telephone})
                .exec(function(error,user){
                    if(error)
                    {
                        callback(error)
                    }
                    if(!user)
                    {
                        var err = new Error("User not found")
                        err.message = "User not found"
                        callback(err)
                    }
                    callback(null,user.Notifications)
                })
}
NotificationSchema.statics.AddNotification = function(telephone, NotificationObject, callback){
    // because the function replaces the notification object with the incoming object 
    // Only notification object that contains the new notification object as appended object shall be sent
    // to this function. Otherwise, the function will replace the existing data with unintended one.
    Notification.updateOne({userTel:telephone},{$set:{Notifications:NotificationObject}})
                .exec(function(error, response){
                    if(error)
                    {
                        callback(error)
                    }
                });
}


var Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification