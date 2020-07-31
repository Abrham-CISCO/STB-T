var mongoose = require('mongoose');
var contactsObject = [];
var noDuplicate = true;
var MessageSchema = new mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        required: true
    },
    History: {
        type:Object,
        default:
            [
                {
                    fromID:"0911675507",
                    toID:"0923276844",
                    body:"Hi Abrham",
                    domain:"Personal",
                    read:false
                },
                {
                    fromID:"0923276844",
                    toID:"0911675507",
                    body:"Hi Getachew",
                    domain:"Personal",
                    read:false
                }
            ]
    }
});
// Write here a code that returns contacts of the requested person
MessageSchema.statics.contact = function(userID,callback)
{
    Message.findOne({userID:userID})      
            .exec(function(error, messageHistoryL){
                if(error)
                {
                    next(error);
                }
                else if(!messageHistoryL)
                {
                    var err = new Error("User not found");
                    err.emessage = "User Not Found!"
                    err.status = 401;
                    console.log("Error");
                    return callback(err,null);
                }
                for(var i = 0; i < messageHistoryL.History.length; i++)
                {
                    if(!(messageHistoryL.History[i].fromID == userID))
                    {
                        // Register the contact
                        for(var j=0; j<contactsObject.length;j++)
                        {
                            if(contactsObject[j] == messageHistoryL.History[i].fromID)
                            {
                                noDuplicate = false;
                            }
                        }
                        if(noDuplicate == true)
                        {
                            contactsObject.push(messageHistoryL.History[i].fromID);
                            noDuplicate = true;
                        }
                    }else{
                        if(!(messageHistoryL.History[i].toID == userID))
                        {
                            for(var j=0; j<contactsObject.length;j++)
                            {
                                if(contactsObject[j] == messageHistoryL.History[i].toID)
                                {
                                    noDuplicate = false;
                                }
                            }
                            if(noDuplicate == true)
                            {
                                contactsObject.push(messageHistoryL.History[i].toID);
                                noDuplicate = true;
                            }
                        }
                    }
                    return callback(null,contactsObject)
                }
            });    
}
MessageSchema.statics.messageHistory = function(fromTel,callback)
{
    Message.findOne({userID:fromTel})
            .exec(function(error, message){
                if(error)
                {
                    return callback(err,null);
                }
                else if(!message)
                {
                    var err = new error("Messgaes not found for this user");
                    err.status = 401;
                    return callback(err,null);
                }
                console.log(message);
                return callback(null, message);
            });    
}
MessageSchema.statics.MessageAdder = function(Tel,messageObject, callback){
    Message.updateOne({userID:Tel}, {$set:{History:messageObject}})
        .exec(function(error,user){
            if(error){
                next(error);
            }
            else if(!user){
                var err = new Error("User Not Found");
                err.status = 401;
                return callback(err);
            }
            return callback(null,user)
        });
}
var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;