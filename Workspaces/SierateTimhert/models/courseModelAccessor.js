const ClassRoomInd = require('./classRoomInd');
var course = require('./course');

const createCourse = function(name, description, createdBy, callback)
{
    var courseObject = {
        name:name,
        description:description,
        createdBy:createdBy,
    }
    course.create(courseObject).then((newCourse) => {
            callback(null, newCourse)
        }).catch((error) => callback(error))
}

const courseDetail = function(courseId,callback)
{
    course.findById(courseId).then((courseDetails)=>{callback(null, courseDetails)}).catch((error)=>{callback(error, false)});
}

// const courseDetailPR(courseId) = new Promise((successFunction, failureFunction)=>{
//     course.findById(courseId).then(
//         function(courseDetails){successFunction(courseDetails)}).catch(
//         function(error){failureFunction(error)});
// })

const updateCourseDetail = function(courseId, inputObject, callback)
{
    course.findById(courseId).then((courseDetails)=>
    {
        courseDetails = inputObject;
        courseDetails.save().then((error, savedCourse) => {
            if(error)
            {
                callback(error)
            }
            else
            {
                callback(savedCourse)
            }
        })
    });
}

const allCourses = function(callback)
{
    course.find({},{name:true, _id:true}).then((courses)=>
    {
        callback(null, courses)
    }).catch((error) => {callback(error)});
}
const addCourse = function(courseIdArray, gubayeId, callback)
{
        // What does happen when a course is added to a classroom
        // An instance of (MarkList, MarklistColumnName, Book and Attendance) for that newly added gubaye is added to the course. 
    courseIdArray.forEach((courseId)=>{
        course.findById(courseId)
        .then((singleCourse) => 
        {
            var defaultMarkListName =     
            {
                classRoomId:gubayeId,
                MarkListColumn_1_name:"10",
                MarkListColumn_2_name:"10",
                MarkListColumn_3_name:"10",
                MarkListColumn_4_name:"10",
                MarkListColumn_5_name:"10",
                MarkListColumn_6_name:"10",
                MarkListColumn_7_name:"10",
                MarkListcolumn_8_name:"10",
                MarkListcolumn_9_name:"10",
                MarkListcolumn_10_name:"10",
                MarkListColumn_11_name:"10",
                MarkListColumn_12_name:"10",
                MarkListColumn_13_name:"10",
                MarkListColumn_14_name:"10",
                MarkListColumn_15_name:"10"
            }
            singleCourse.markListColumnName.push(defaultMarkListName);
            singleCourse.save();
            callback(null, singleCourse)
        }).catch((error) => {callback(error)});
    });
}

const courseIds = (nameArray, callback) => {
    var searchObj = {
        $or: [
            ]
        }
    

    for(var i = 0; i<nameArray.length; i++)
    {
        searchObj.$or.push({name:nameArray[i]})
    }

    
    console.log(nameArray,searchObj)

    course.find(searchObj).then((courses)=>{
        var idOnly = []; 
        idOnly.pop();

        courses.forEach(coursee =>{
            idOnly.push(coursee._id);
        })
        callback(null, idOnly)
    }).catch((error) => {callback(error, false)})
    
}

const deleteCourse = (courseId, callback) => 
{
    course.deleteById(courseId).then((status) => {callback(null,status)}).catch((error) => {callback(error)})
}
// Every model accessor should have document creating, reading, editing and deleting methods

// Book sub document model accessor
const booksByCourse = (courseId, callback)=>{course.findById(courseId).then((course)=>{
    callback(null, course.books)
}).catch((error)=>{callback(error)});}

const addBook = (courseId, bookObject, callback)=>{course.findById(courseId).then((course)=>{
    course.books.push(bookObject)
    course.save
    callback(null, course.books)
}).catch((error)=>{callback(error)});}

const deleteBook = (courseId, bookId, callback) => {course.findById(courseId).then((course)=>{
    course.books.forEach(book => {
        if(book._id == bookId)
        {
            course.books.splice(index,1) 
        }
    }, index);
    callback(null, course.books)
}).catch((error)=>{callback(error)});}

// Marklist Sub-docuement - create, edit, remove, read

const MarkListByClassRoom = (courseId, classRoomId, callback) => {
    course.findById(courseId).then((singleCourse)=>{
        var MarkListObject = [];
        MarkListObject.pop();
        singleCourse.markList.map(mkList => {
            if(mkList.classRoomId == classRoomId)
            {
                MarkListObject.push(mkList);   
            }
        },index);
        callback(null, MarkListObject);
    }).catch((error)=>{callback(error, false)})   
}

const UpdateMarkList = (courseId, InputObject, classRoomId, callback) => {
    course.findById(courseId).then((singleCourse)=>{
        singleCourse.markList = InputObject;
        singleCourse.save().then((notification) => {
          callback(null, singleCourse);  
        }).catch((error)=>{callback(error, false)})
    }).catch((error)=>{callback(error, false)})   
}

const DeleteMarkListByClassroom = (courseId, classRoomId, callback) =>
{
    course.findById(courseId).then((singleCourse) => {
        singleCourse.markList.findMany({classRoomId:classRoomId}).then((singleCourseByClassRoom)=>
            {
                singleCourseByClassRoom.remove();
                callback(null,true);
            }).catch((error)=>{callback(error, false)})  
    }).catch((error)=>{callback(error, false)})  
}
const DeleteMarkListByClassroomAndStudent = (courseId, classRoomId, studentId, callback) =>
{
    course.findById(courseId).then((singleCourse) => {
    singleCourse.markList.findOne({classRoomId:classRoomId, studentId:studentId}).then((singleCourseByClassRoomAndStudent)=>
        {
            singleCourseByClassRoomAndStudent.remove();
            callback(null,true);
        }).catch((error)=>{callback(error, false)})  
    }).catch((error)=>{callback(error, false)})  
}
const DeleteMarkListByStudent = (studentId, callback) =>
{
    course.findById(courseId).then((singleCourse) => {
        singleCourse.markList.findMany({studentId:studentId}).then((singleCourseByStudent)=>
            {
                singleCourseByStudent.remove();
                callback(null,true);
            }).catch((error)=>{callback(error, false)})  
    }).catch((error)=>{callback(error, false)})    
}

const MarkListByStudent = (courseId, studentId, callback) => {
    course.findById(courseId).then((singleCourse)=>{
        var MarkListObject = [];
        MarkListObject.pop();
        singleCourse.markList.map(mkList => {
            if(mkList.studentId == studentId)
            {
                MarkListObject.push(mkList);   
            }
        },index);
        callback(null, MarkListObject);
    }).catch((error)=>{callback(error, false)})   
}


// Marklist Name Sub-document - create, edit, remove, read
const MarklistCoulmnName = (courseId, classRoomId, callback) =>
{
    course.findById(courseId).then((singleCourse)=>{
        singleCourse.markListColumnName.findOne({classRoomId:classRoomId}).then((singleCourseCoulmnName) => {
            callback(null,singleCourseCoulmnName);
        }).catch((error)=>{callback(error, false)})
    }).catch((error)=>{callback(error, false)}) 
}

const DeleteMarklistName = (courseId, classRoomId, callback) =>
{
    course.findById(courseId).then((singleCourse)=>{
        singleCourse.markListColumnName.findOne({classRoomId:classRoomId}).then((singleCourseCoulmnName) => {
            singleCourseCoulmnName.remove();
            singleCourseCoulmnName.save();
            callback(null,singleCourseCoulmnName);
        }).catch((error)=>{callback(error, false)})
    });
}

const changeMarklistName = (courseId, classRoomId, inputObject, callback) =>
{
    course.findById(courseId).then((singleCourse)=>{
        singleCourse.markListColumnName.findOne({classRoomId:classRoomId}).then((singleCourseCoulmnName) => {
            singleCourseCoulmnName = inputObject;
            singleCourseCoulmnName.save();
            callback(null,singleCourseCoulmnName);
        }).catch((error)=>{callback(error, false)})
    });
}


const createMarkList = (courseId, classRoomId, inputObject, callback) => 
{
    course.findById(courseId).then((singleCourse)=>{
        singleCourse.markListColumnName.create(inputObject).then((newMarkListName)=>{
            callback(null, newMarkListName);
        }).catch((error)=>{callback(error, false)})
    });
}

// Attendance Sub-docuement - add, edit, remove, read
const readAtendance = (courseId, classRoomId,callback) => {
    course.findById(courseId).then((singleCourseAttendance) => {
        singleCourseAttendance.attendance.findMany({classRoomId:classRoomId}).then((singleCourseAndClassAttendance)=>{
            callback(null,singleCourseAndClassAttendance)
        })
    }).catch((error)=>{callback(error, false)})
}

const addAttenanceElement = (courseId, studentObject, callback) => {
    course.findById(courseId).then((singleCourseAttendance) => {
        singleCourseAttendance.push(studentObject)
        singleCourseAttendance.save().then((singleCourseAttendance) => {callback(null,singleCourseAttendance)
        }).catch((error)=>{callback(error, false)})
    }).catch((error)=>{callback(error, false)})
}

// date:{type:Date},
// classRoomId:{type:String},
// studentId:{type:String},
// studentTelephone:{type:String},
// abscent:{type:Boolean},
// late:{type:Boolean},
// permission:{type:Boolean},
// remark:{type:Boolean},
// lateTime:{type:String}

const upadteAttenanceElement = (courseId, attendanceObject, callback) => {
    course.findById(courseId).then((singleCourseAttendance) => {
        singleCourseAttendance.attendance.updateOne({date:attendanceObject.date, 
        classRoomId:attendanceObject.classRoomId, studentId:attendanceObject.studentId},
        {$set:{abscent:attendanceObject.abscent,late:attendanceObject.late,permission:attendanceObject.permission,
            remark:attendanceObject.remark,lateTime:attendanceObject.lateTime}});
    }).catch((error)=>{callback(error, false)})
}

const removeAttendanceElement = (courseId, classRoomId, date, studentId, callback) => {
    course.findById(courseId).then((singleCourseAttendance) => {
        singleCourseAttendance.attendance.findOne({classRoomId:classRoomId, date:date,
        studentId:studentId}).then((singleCourseAndClassAttendance)=>{
            singleCourseAndClassAttendance.remove(notification => {
                callback(null, notification)
            }).catch((error)=>{callback(error, false)})
        })
    }).catch((error)=>{callback(error, false)})
}

const removeAttendanceByClass = (courseId, classRoomId, callback) => {
    course.findById(courseId).then((singleCourseAttendance) => {
        singleCourseAttendance.attendance.findMany({classRoomId:classRoomId}).then((singleCourseAndClassAttendance)=>{
            singleCourseAndClassAttendance.remove();
        })
    }).catch((error)=>{callback(error, false)})
}

// Marklist Sub-docuement - create, edit, remove, read
exports.MarkListByClassRoom = MarkListByClassRoom;
exports.MarkListByStudent = MarkListByStudent;
exports.UpdateMarkList = UpdateMarkList;
exports.DeleteMarkListByClassroom = DeleteMarkListByClassroom;
exports.DeleteMarkListByClassroomAndStudent = DeleteMarkListByClassroomAndStudent;
exports.DeleteMarkListByStudent = DeleteMarkListByStudent;

// Marklist Name Sub-document - create, edit, remove, read
exports.changeMarklistName = changeMarklistName;
exports.createMarkList = createMarkList;
exports.DeleteMarklistName = DeleteMarklistName;
exports.MarklistCoulmnName = MarklistCoulmnName;

// Attendance Sub-docuement - add, edit, remove, read
exports.readAtendance = readAtendance;
exports.upadteAttenanceElement = upadteAttenanceElement;
exports.addAttenanceElement = addAttenanceElement;
exports.removeAttendanceElement = removeAttendanceElement;
exports.removeAttendanceByClass = removeAttendanceByClass;


exports.createCourse = createCourse;
// exports.courseDetailPR = courseDetailPR;
exports.courseDetail = courseDetail;
exports.deleteCourse = deleteCourse;
exports.updateCourseDetail = updateCourseDetail;
exports.addCourse = addCourse;
exports.allCourses = allCourses;
exports.courseIds = courseIds;

exports.addBook = addBook;
exports.booksByCourse = booksByCourse;
exports.deleteBook = deleteBook;