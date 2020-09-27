var mongoose = require("mongoose");
var courseSchema = new mongoose.Schema({
    course_id:{type:String}
},{timestamps:true})
var classRoomSchema = new mongoose.Schema({
    name:{type:String,unique:true,required:true},
    description:{type:String},
    leader:{type:String},
    members:[
        {
            memberId:{
                type:String
            }
        }
    ]
    ,addedCourses:[courseSchema]
},{timestamps:true});

classRoomSchema.statics.removeMember = (GubayeID,telephone,callback) => {
    classRoom.findOne({_id:GubayeID})
            .exec(function(error,gubaye){
                if(error)
                {
                    callback(error)
                }
                else
                {
                    gubaye.members.forEach(function(member, index, ar){
                        if(member.memberId == telephone)
                        {
                            console.log(member.memberId, index, telephone)
                            console.log(gubaye.members.splice(index,1))
                            gubaye.save();
                        }
                    })
                    callback(null,gubaye)
                }

            })
}
classRoomSchema.statics.addMember = (ClassRoomID,membersArray,callback) => {
    classRoom.findOne({_id:ClassRoomID})
            .exec(function(error, gubaye){
                if(!error)
                {
                    var Members = gubaye.members
                    console.log("gubaye ", gubaye);
                    for(var i =0; i<membersArray.length;i++)
                    {
                        Members.push({memberId:membersArray[i].telephone});
                    }
                    classRoom.updateOne({_id:ClassRoomID},{$set:{members:Members}})
                    .exec(function(error,response){
                        if(!error)
                        {
                            callback(null,response);
                        }
                    })
                }
            })

}
classRoomSchema.statics.gubayeDetails =  (ClassRoomID, callback) => {
    classRoom.findOne({_id:ClassRoomID})
            .exec(function(error, gubaye){
                if(error)
                {
                    callback(error)
                }
                if(!gubaye)
                {
                    err = new Error("No Gubaye with this gubaye ID");
                    err.message = "No Gubaye with this gubaye ID";
                    callback(err)
                }
                callback(null,gubaye);
            })
} 

classRoomSchema.statics.AllGubayeats = (callback) => {
    classRoom.find({})
            .exec(function(error, gubayeats){
                callback(null,gubayeats);
            })
}

classRoomSchema.statics.UpdateInfo = (ClassRoomID, gubayeName, Description, leader, callback) => {
    classRoom.updateOne({_id:ClassRoomID},{$set:{name:gubayeName,description:Description,leader:leader}})
            .exec((error,result)=>{
                if(error)
                {
                    callback(error)
                }
                else
                {
                    callback(null,result);
                }
            })
}
classRoomSchema.statics.DeleteGubaye = (ClassRoomID,callback) => {
    classRoom.findByIdAndRemove(ClassRoomID,function(error,result) {
        if(error)
        {
            callback(error)
        }
        else{
            callback(null,result)
        }
    })
}

classRoomSchema.statics.IDArrayToNameArray = function(idArray, callback){

    var searchObj = {
        $or: [
            ]
        }
    for(var i = 0; i<idArray.length; i++)
    {
        searchObj.$or.push({_id:idArray[i]})
    }
    console.log("CRM ", searchObj)
    classRoom.find(searchObj,{name:true,_id:false})
        .exec(function(error, gubayeats){
            if(error){
                console.log(error)
            }
            return callback(null,gubayeats);
        })
}

var classRoom = mongoose.model('classRoom',classRoomSchema);
module.exports = classRoom;