var mongoose = require('mongoose');
var courseSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    description:{
        type:String,
        default:"No description!"
    }
})

var course = mongoose.model('course',courseSchema);
module.exports = course