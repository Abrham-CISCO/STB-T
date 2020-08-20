var Mongoose = require("mongoose");
var classRoomSchema = new Mongoose({
    name:{type:String,unique:true,required:true},
    members:[
        {
            memberId:{
                type:String,
                unique:true
            }
        }
    ]
});

var classRoom = mongoose.model('classRoom',classRoomSchema);
module.exports = classRoomSchema;