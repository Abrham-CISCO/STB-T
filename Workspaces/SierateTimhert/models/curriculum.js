var mongoose = require('mongoose');
var courseSchema = new mongoose.Schema({
    course_id:{type:String},
    order:{type:String},
    activated:{type:Boolean}
},{timestamps:true})
var gradeSchema = new mongoose.Schema({
    created_By:{type:String},
    name:{type:String},
    courses:[courseSchema],
    description:{type:String},
},{timestamps:true});
var curriculumSchema = new mongoose.Schema({
    created_By:{type:String},
    name:{type:String},
    grades:[gradeSchema],
    description:{type:String}
},{timestamps:true})

var curriculum = mongoose.model('curriculum',curriculumSchema);
module.exports = curriculum;