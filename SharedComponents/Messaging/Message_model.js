var mongoose = require('mongoose');
var MessageSchema = new mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        required: true
    },
    Messages: {
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

MessageSchema.statics.messageHistory = function(fromTel,callback)
{
    Message.findOne({userID:fromTel})
            .exec(function(error, message){
                if(error)
                {
                    next(error);
                }
                else if(!message)
                {
                    var err = new error("Messgaes not found for this user");
                    err.status = 401;
                    return(err);
                }
                console.log(message);

                return callback(null, message);
            });    
}

MessageSchema.statics.MessageAdder = function(Tel,messageObject, callback){
    Message.updateOne({userID:Tel}, {$set:{Messages:messageObject}})
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