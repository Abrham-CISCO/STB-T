var classRoom = require('./classRoom')
var UserAccModelAcc = require('../../../Account/Models/user_model_accessor');
var course_modelAccessor = require('./courseModelAccessor');
const gubayeDetail = (GubayeID, callback) => {
    classRoom.gubayeDetails(GubayeID, function(error,gubaye){
        callback(null,gubaye);
    });
}

const memberAdder = (gubayeID, Members, callback) => {
    classRoom.addMember(gubayeID,Members,function(error,response){
        if(!error){
            UserAccModelAcc.AddMemberToG(Members,gubayeID,function(error,response){
                if(!error)
                {
                    callback(null,response);
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
        console.log("CMA ", gubaeyat)
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
            console.log({course_id:courseId})
            gubaye.addedCourses.push({course_id:courseId})
        })
        gubaye.save().then().catch((error) => {callback(error,false)})
        callback(null,gubaye)
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
            console.log("courses ", courses)
            console.log(gubaye.addedCourses)
            courses.forEach((course)=> {
                addedFlag = false;
                gubaye.addedCourses.forEach((addedCourse)=>{
                    console.log(course._id)
                    if(course._id == addedCourse.course_id)
                    {
                        console.log(course._id, " is equal with ", addedCourse.course_id)
                        addedFlag = true;
                    }
                    else
                    {
                        console.log(course._id, " is not equal with ", addedCourse.course_id)
                    }
                })
                if(addedFlag == false)
                {
                    notAdded.push({name:course.name, id:course._id})
                }
                else
                {
                    AddedC.push({name:course.name, id:course._id})
                }
            })
            console.log(notAdded)
            callback(null, notAdded, AddedC)
        })
    }).catch((error) => {callback(error,false)})
}

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