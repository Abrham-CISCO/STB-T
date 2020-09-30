var mongoose = require('mongoose');
var attendanceSchema = new mongoose.Schema({
  date:{type:Date},
  classRoomId:{type:String},
  studentId:{type:String},
  studentTelephone:{type:String},
  abscent:{type:Boolean},
  late:{type:Boolean},
  permission:{type:Boolean},
  remark:{type:Boolean},
  lateTime:{type:String}
},{timestamps:true})
var markListSchema = new mongoose.Schema({
    studentId:{type:String},
    classRoomId:{type:String},
    studentTelephone:{type:String},
    column_1_value:{type:String},
    column_2_value:{type:String},
    column_3_value:{type:String},
    column_4_value:{type:String},
    column_5_value:{type:String},
    column_6_value:{type:String},
    column_7_value:{type:String},
    column_8_value:{type:String},
    column_9_value:{type:String},
    column_10_value:{type:String},
    column_11_value:{type:String},
    column_12_value:{type:String},
    column_13_value:{type:String},
    column_14_value:{type:String},
    column_15_value:{type:String},
},{timestamps:true});
var markListColumnNameSchema = new mongoose.Schema({
    classRoomId:{type:String},
    MarkListColumn_1_name:{type:String},
    MarkListColumn_2_name:{type:String},
    MarkListColumn_3_name:{type:String},
    MarkListColumn_4_name:{type:String},
    MarkListColumn_5_name:{type:String},
    MarkListColumn_6_name:{type:String},
    MarkListColumn_7_name:{type:String},
    MarkListcolumn_8_name:{type:String},
    MarkListcolumn_9_name:{type:String},
    MarkListcolumn_10_name:{type:String},
    MarkListColumn_11_name:{type:String},
    MarkListColumn_12_name:{type:String},
    MarkListColumn_13_name:{type:String},
    MarkListColumn_14_name:{type:String},
    MarkListColumn_15_name:{type:String},
},{timestamps:true})
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
        type:String,
        default:"http://localhost:3000/Workspaces/SierateTimhert/static/kerestosyehulugetanew.pdf"
    },
    attendance:[attendanceSchema],
    markListColumnName:[markListColumnNameSchema],
    books:[booksSchema],
    markList:[markListSchema]
},{timestamps:true})

var course = mongoose.model('course',courseSchema);
module.exports = course
