var mongoose = require('mongoose');
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
                    fromName:"ጌታቸው ብሩ",
                    fromID:"0911675507",
                    toID:"0923276844",
                    toName:"አብርሀም ጌታቸው",
                    body:"Hi Abrham",
                    domain:"Personal",
                    read:false
                },
                {
                    fromName:"አብርሀም ጌታቸው",
                    fromID:"0923276844",
                    toID:"0911675507",
                    toName:"ጌታቸው ብሩ",
                    body:"Hi Getachew",
                    domain:"Personal",
                    read:false
                },
                {
                    fromName:"ሶስና ሰሀሉ",
                    fromID:"0913706279",
                    toID:"0923276844",
                    toName:"አብርሀም ጌታቸው",
                    body:"Hi Abrham",
                    domain:"Personal",
                    read:false
                },
                {
                    fromName:"አብርሀም ጌታቸው",
                    fromID:"0923276844",
                    toID:"0913706279",
                    toName:"ሶስና ሰሀሉ",
                    body:"Hi Sosina",
                    domain:"Personal",
                    read:false
                },
                {
                    fromName:"ሶስና ሰሀሉ",
                    fromID:"0913706279",
                    toID:"0911675507",
                    toName:"ጌታቸው ብሩ",
                    body:"Hi Getachew",
                    domain:"Personal",
                    read:false
                },
                {
                    fromName:"ጌታቸው ብሩ",
                    fromID:"0911675507",
                    toID:"0913706279",
                    toName:"ሶስና ሰሀሉ",
                    body:"Hi Sosina",
                    domain:"Personal",
                    read:false
                }
            ]
    }
});
// Write here a code that returns contacts of the requested person
MessageSchema.statics.contact = function(userID,callback)
{
    var Duplicate = false;
    var contactsObject = [{
        userName:String,
        tel:String
    }];
    contactsObject.pop();
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
                    return callback(err,null);
                }
                for(var i = 0; i < messageHistoryL.History.length; i++)
                {
                    if((messageHistoryL.History[i].fromID == userID))
                    {
                        // Register the contact
                        Duplicate = false;
                        for(var j=0; j<contactsObject.length;j++)
                        {
                            if(contactsObject[j].tel == messageHistoryL.History[i].toID)
                            {
                                Duplicate = true;
                            }
                        }
                        if(Duplicate == false)
                        {
                            contactsObject.push({userName:messageHistoryL.History[i].toName,tel:messageHistoryL.History[i].toID});
                        }
                    }
                    if((messageHistoryL.History[i].toID == userID))
                    {
                        Duplicate = false;
                        for(var j=0; j<contactsObject.length;j++)
                        {
                            if(contactsObject[j].tel == messageHistoryL.History[i].fromID)
                            {
                                Duplicate = true;
                            }
                        }
                        if(Duplicate == false)
                        {
                            contactsObject.push({userName:messageHistoryL.History[i].fromName,tel:messageHistoryL.History[i].fromID});
                        }
                    }
                }
                return callback(null,contactsObject)
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
                    var err = new Error("Messgaes not found for this user");
                    err.status = 401;
                    return callback(err,null);
                }
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