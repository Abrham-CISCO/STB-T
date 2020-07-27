var mongoose = require('mongoose');
var SocketSchema = new mongoose.Schema({
    userID:{
        type:String,
        required: true
    },
    socketId:{
        type:String,
        required:true
    }
});

SocketSchema.statics.registerSocket = function(socketID, UserID, callback){
    SocketSchema.insertOne({userID:UserID,socketId:socketID})
    .exec(function(ack,error){
        if(error){
            var err = new Error("An Error Has occured!");
            return callback(error)
        }
        else if(!ack){
            var err = new Error("No response!");
            return callback(error)
        }
        return callback(ack,null);
    });
}

var scoketDB = mongoose.model('socketDB', SocketSchema);
module.exports = scoketDB;