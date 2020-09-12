var mongoose = require("mongoose");
var classRoomsSchema = new mongoose.Schema({
    classID:{type:String}
},{timestamps:true})

var classRoomIndSchema = new mongoose.Schema({
    name:{type: String, default:"የአባል ስም"},
    userTel:
    {
        type: String,
        unique: true,
        required: true
    },
    joinedClasses:[classRoomsSchema]
},{timestamps:true})

classRoomIndSchema.statics.AddMemberToGroup = function(UserTelephone, GroupID, callback)
{
    ClassRoomInd.find({userTel:UserTelephone})
                .exec(function(error,user){
                    if(error)
                    {
                        callback(error)
                    }
                    else{
                        user[0].joinedClasses.push({classID:GroupID});
                        user[0].save()
                        callback(null,user)
                    }
                })
}

var ClassRoomInd = mongoose.model('classRoomInd',classRoomIndSchema);
module.exports = ClassRoomInd;