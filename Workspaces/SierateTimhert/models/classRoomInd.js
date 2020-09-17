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

classRoomIndSchema.statics.leave = function(userTelephone, groupID, callback)
{
    ClassRoomInd.findOne({userTel:userTelephone},function(error,user)
    {
        if(error)
        {
            callback(error)
        }
        else{
            user.joinedClasses.forEach(function(Gubaye,index,ar){
                if(Gubaye.classID == groupID)
                {
                    user.joinedClasses.splice(index,1)
                    user.save();
                }
                callback(null,user)
            })
        }
    });
}

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