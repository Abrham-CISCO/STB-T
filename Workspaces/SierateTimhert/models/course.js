var mongoose = require('mongoose');
var attendanceSchema = new mongoose.Schema({
  date:{type:Date},
  classRoomId:{type:String},
  studentId:{type:String},
  studentTelephone:{type:String},
  abscent:{type:Number},
  late:{type:Boolean},
  permission:{type:Boolean},
  remark:{type:String},
  lateTime:{type:String}
},{timestamps:true})
var attendanceColumnNameSchema = new mongoose.Schema({
    columnName:{type:String},
    classRoomId:{type:String},
    remark:{type:String}
})
var markListSchema = new mongoose.Schema({
    studentId:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    // use mongoose populate
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
    column_10_value:{type:String}
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
    MarkListColumn_8_name:{type:String},
    MarkListColumn_9_name:{type:String},
    MarkListColumn_10_name:{type:String},
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
        default:"ምንም ማብራሪያ የለውም"
    },
    courseOutline:{
        type:String,
        default:""
    },
    attendance:[attendanceSchema],
    markListColumnName:[markListColumnNameSchema],
    books:[booksSchema],
    markList:[markListSchema],
    attendanceColumnName:[attendanceColumnNameSchema]
},{timestamps:true})


var course = mongoose.model('course',courseSchema);
module.exports = course

