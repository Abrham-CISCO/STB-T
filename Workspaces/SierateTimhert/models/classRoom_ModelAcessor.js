var classRoom = require('./classRoom')
var UserAccModelAcc = require('../../../Account/Models/user_model_accessor');
var course_modelAccessor = require('./courseModelAccessor');
const course = require('./course');
const curriculum = require('./curriculum');
const gubayeDetail = (GubayeID, callback) => {
    classRoom.findById(GubayeID).then((gubaye) => {callback(null,gubaye);}).catch((error)=>{callback(error)})
}

// you need to create a function that converts an array of gubayeId to an array of gubaye name

const gubayeIdArrayToNameArray = (gubayeIdArray, callback) =>
{
    if(gubayeIdArray.length != 0)
    {
        var searchObject = {
            $or: [
            ]
        }
    
        gubayeIdArray.forEach((gubayeId) => {
            searchObject.$or.push({_id:gubayeId});
        })
        var gNames = [
            {name:String,_id:String,membersCount:Number,leader:String}
        ]
        gNames.pop();
        classRoom.find(searchObject).then((gubayeat)=>
        {
            gubayeat.forEach((gubaye)=>
            {
                gNames.push({name:gubaye.name,_id:gubaye._id,membersCount:gubaye.members.length,leader:gubaye.leader})
            })
            callback(null,gNames)
        }).catch((error)=>{callback(error, false)})
    }
    else{
        callback(null,{})
    }
}
const memberAdder = (gubayeID, Members, callback) => {
    classRoom.addMember(gubayeID,Members,function(error,response){
        if(!error){
            UserAccModelAcc.AddMemberToG(Members,gubayeID,function(error,response){
                if(!error)
                {
                    course_modelAccessor.addStudent(Members,gubayeID,function(err, notification){
                        if(!err)
                        {
                            if(notification == false)
                            {
                                callback(null,false)
                            }
                            else
                            {
                                callback(null,response)
                            }

                        }
                        else
                        {
                            
                        }
                    })
                }
                else
                {

                }
            })
        }
    })
}

const createGubaye =  (gubayeName,gubayeDescription,callback) =>{
    var gubayeObject = {
        name: gubayeName,
        description:gubayeDescription,
        leader:"No One",
        members:[]
    }
    classRoom.create(gubayeObject, function(error, gubaye){
        if(error)
        {
            callback(error)
        }
        callback(null, gubaye)
    })
}

const Gubaeyat = (callback) => {
    classRoom.AllGubayeats(function(error, gubaeyat){
        callback(null,gubaeyat)
    })
}

const updateGubaye = (ClassRoomID, gubayeName, Description, leader, callback) => {
    classRoom.UpdateInfo(ClassRoomID, gubayeName, Description, leader, function(error, result){
        if(error)
        {
            callback(error)
        }
        else{
            callback(null,result)
        }
    })
}

const UpdateGubaye_ForMember = (ClassRoomID, gubayeName, Description,  callback) => {
    classRoom.UpdateInfo_ForMember(ClassRoomID, gubayeName, Description, function(error, result){
        if(error)
        {
            console.log(error)
            callback(error)
        }
        else{
            callback(null,result)
        }
    })
}
const removeMem = (GubayeID,telephone,callback) =>
{
    classRoom.removeMember(GubayeID,telephone,function(error, gubaye){
        if(error)
        {
            callback(error)
        }
        else{
            callback(null,gubaye)
        }
    });
}
const deleteGubaye = (ClassRoomID, callback) => {
    classRoom.DeleteGubaye(ClassRoomID,function(error,result){
        if(error)
        {
            callback(error)
        }
        else{
            callback(null,result)
        }
    })
}
const IDArrayToNameArray = (IDArray,callback) => {
    classRoom.IDArrayToNameArray(IDArray,function(error, gubaeyat){
        if(error)
        {
            callback(error)
        }
        else{
            callback(null,gubaeyat)
        }
    })
}

const addCourse = (gubayeId,coursesArray,callback) => 
{
    classRoom.findById(gubayeId).then((gubaye)=>
    {
        coursesArray.forEach((courseId) => {
            gubaye.addedCourses.push({course_id:courseId})
        })
        gubaye.save().then((response) => {callback(null,gubaye)
        }).catch((error) => {callback(error,false)})
        
    }).catch((error) => {callback(error,false)})
}

const notAddedCourses = (gubayeId, callback) => 
{
    var addedFlag = false;
    classRoom.findById(gubayeId).then((gubaye) => {
        course_modelAccessor.allCourses(function(error,courses){
            var notAdded = [{name:String, id:String}]
            notAdded.pop();
            var AddedC = [{name:String, id:String}]
            AddedC.pop();
            courses.forEach((course)=> {
                addedFlag = false;
                gubaye.addedCourses.forEach((addedCourse)=>{
                    if(course._id == addedCourse.course_id)
                    {
                        addedFlag = true;
                    }
                })
                if(addedFlag == false)
                {
                    notAdded.push({name:course.name, id:course._id})
                }
                else
                {
                    AddedC.push({name:course.name, id:course._id})
                    addedFlag = false
                }
            })
            callback(null, notAdded, AddedC)
        })
    }).catch((error) => {callback(error,false)})
}

const removeCourse = (courseID, GubayeId, callback) => 
{
    classRoom.findOne({_id:GubayeId}).then((gub)=>{
        var index=0;
        gub.addedCourses.forEach((singleCourse) => {
            
            if(singleCourse.course_id === courseID)
            {
                gub.addedCourses.splice(index,1)       
            }
            index += 1;
        });
        classRoom.findByIdAndUpdate(GubayeId,{$set:gub}).then((resp)=>
        {
            callback(null,resp);
        }).catch((error) => {callback(error,false)})


        // gub.addedCourses.findOne({course_id:courseID}).then((course)=>
        // {
        //     course.remove().then(notification=> {
        //         course.save().then(response=>{
        //             callback(null,notification)
        //         }).catch((error) => {callback(error,false)})                
        //     }).catch((error) => {callback(error,false)})
        // }).catch((error) => {callback(error,false)})
    }).catch((error) => {callback(error,false)})
}

const assignCurriculumToGubaye = (curriculumId, gubayeId, callback) => {
    classRoom.findById(gubayeId).then(gubayeF => {
        gubayeF.curriculum = curriculumId;
        gubayeF.save().then(confirmation => {
            callback(null, confirmation);
        }).catch(err=>callback(err,false))
    })
}
exports.assignCurriculumToGubaye = assignCurriculumToGubaye;
exports.removeCourse = removeCourse;
exports.notAddedCourses = notAddedCourses;
exports.IDArrayToNameArray = IDArrayToNameArray;
exports.deleteGubaye = deleteGubaye;
exports.Gubaeyat = Gubaeyat;
exports.gubayeDetail = gubayeDetail;
exports.createGubaye = createGubaye;
exports.memberAdder = memberAdder;
exports.updateGubaye = updateGubaye;
exports.removeMem = removeMem;
exports.addCourse = addCourse;
exports.gubayeIdArrayToNameArray = gubayeIdArrayToNameArray;
exports.UpdateGubaye_ForMember = UpdateGubaye_ForMember;