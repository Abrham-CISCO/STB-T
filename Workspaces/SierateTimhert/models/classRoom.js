var mongoose = require("mongoose");
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
},{timestamps:true});
classRoomSchema.statics.addMember = (ClassRoomID,membersArray,callback) => {
    classRoom.findOne({_id:ClassRoomID})
            .exec(function(error, gubaye){
                if(!error)
                {
                    var Members = gubaye.members
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