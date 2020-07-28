var mongoose = require('mongoose');
var PWDSchema = new mongoose.Schema({
    uID:{
        type: String,
        required: true
    },
    requestedAt:{
        type: Date,
        default: Date.now
    },
    active:{
        type: Boolean,
        default: true
    },
    verificationCode:{
        type: String,
        required: true
    }
});

PWDSchema.statics.verifyIdentity = function(userID, verCode, callback){
// Check if the verification code is right if it is reply true
    console.log(userID);
    console.log(verCode);
    PWD.findOne({uID:userID, verificationCode:verCode})
           .exec(function(error,PSDrecovery){
               if(error){
                    return next(error);
               }
               else if (!PSDrecovery){
                   var Err = new Error("No Entries Found")
                   Err.status = 401;
                   return callback(Err);
               }
               return callback(null,PSDrecovery);
           });
};

// Account.updateOne({user_ID:userID},{$set:{active:false}});
// return callback(null, true);

var PWD = mongoose.model('PWD',PWDSchema);
module.exports = PWD;