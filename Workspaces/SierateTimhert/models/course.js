var mongoose = require('mongoose');
var booksSchema = new mongoose.Schema({
  bookName:{type:String},
  filePath:{type:String}
},{timestamps:true})
var courseSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    createdBy:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:"No description!"
    },
    courseOutline:{
        type:String
    },
    books:[booksSchema]
},{timestamps:true})

var course = mongoose.model('course',courseSchema);
module.exports = course
