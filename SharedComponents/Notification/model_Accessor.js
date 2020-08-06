var NotificationModel = require('../Models/Notification_model')

const loadNotification = (telehpone,callback) => {
    NotificationModel.LoadNotifications(telehpone, function(error,Notification){
        if(error)
        {
            return callback(error)
        }
        return callback(null,Notification)
    })
} 

const createNotification =  (telephone,callback) =>{
    var notificationObject = {
        userTel: telephone
    }
    NotificationModel.create(notificationObject, function(error, user){
        if(error)
        {
            callback(error)
        }
        callback(null, user)
    })
}

module.exports.createNotification = createNotification;
module.exports.loadNotification = loadNotification;