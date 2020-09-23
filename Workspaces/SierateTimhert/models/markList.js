var mongoose = require('mongoose');
var scores = new mongoose.Schema({
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
})
var markListSchema = new mongoose.Schema({
    userId:{type:String, required:true},
    courseId:{type:String, required: true},
    column_1_name:{type:String},
    column_2_name:{type:String},
    column_3_name:{type:String},
    column_4_name:{type:String},
    column_5_name:{type:String},
    column_6_name:{type:String},
    column_7_name:{type:String},
    column_8_name:{type:String},
    column_9_name:{type:String},
    column_10_name:{type:String},
    column_11_name:{type:String},
    column_12_name:{type:String},
    column_13_name:{type:String},
    column_14_name:{type:String},
    column_15_name:{type:String},
    score:[scores]
})

var markList = mongoose.model('markList', markListSchema);
module.exports = markList;