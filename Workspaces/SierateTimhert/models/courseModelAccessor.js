const ClassRoomInd = require('./classRoomInd');
var course = require('./course');
var mOngoose = require('mongoose')
var user_ModelAccessor = require('../../../Account/Models/user_model_accessor')
var classRoom_modelAccessor = require('./classRoom_ModelAcessor');
const { add } = require('mongoose-auto-number/lib/counterSchema');
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
    course.findById(courseId).populate('markList.studentId').then((courseDetails)=>{callback(null, courseDetails)}).catch((error)=>{callback(error, false)});
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
                MarkListColumn_8_name:"10",
                MarkListColumn_9_name:"10",
                MarkListColumn_10_name:"10"
            }
            singleCourse.markListColumnName.push(defaultMarkListName);
            singleCourse.save();
            callback(null, singleCourse)
        }).catch((error) => {callback(error)});
    });
}

const editCourse = (courseId, inputObject, callback) => {
    course.findByIdAndUpdate(courseId,{$set:inputObject}).then((confirmation)=>{
        callback(null,confirmation);
    }).catch((error) => {callback(error)});
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

// const UpdateMarkList = (courseId, InputObject, classRoomId, callback) => {
//     course.findById(courseId).then((singleCourse)=>{
//         singleCourse.markList = InputObject;
//         singleCourse.save().then((notification) => {
//           callback(null, singleCourse);  
//         }).catch((error)=>{callback(error, false)})
//     }).catch((error)=>{callback(error, false)})   
// }

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

// Write a function that accepts student's mark as an array and register it on the database.

// function registerChanges(userId, coulumnNumber, value, gubayeId, courseId)
const upadteAttenance = (changes, gubayeId, courseId, callback) => {
    var index = 0;
    course.findById(courseId).then((singleCourse)=>{
        changes.forEach((change)=>{
            index=0
            singleCourse.attendance.forEach((update)=>{
                console.log(update._id, change.att_id,"update._id == change.att_id > ",update._id == change.att_id,"change.abscent",change.abscent)
                if(update._id == change.att_id)
                {
                    console.log("detected")
                    if(change.abscent == true)
                    {
                        singleCourse.attendance[index].abscent = 0
                    }
                    else if(change.abscent == false)
                    {
                        singleCourse.attendance[index].abscent = 1                       
                    }
                    console.log(update)
                }
                index += 1;
            })
        })
        singleCourse.save().then((notification)=>{
            callback(null, notification)
        })
    })
}
const populateAttendance = (callback) => {
    var attendanceObj = 
        [{
          date:"2020-10-13T17:23:09.850Z",
          classRoomId:"5f74b6c8166e951ec4cc9351",
          studentId:"5f73319b790b6f11e86ea032",
          studentTelephone:"0923276856",
          abscent:0,
          late:false,
          permission:0,
          remark:"No remark",
          lateTime:""
        },{
          date:"2020-10-14T17:23:09.850Z",
          classRoomId:"5f74b6c8166e951ec4cc9351",
          studentId:"5f73319b790b6f11e86ea032",
          studentTelephone:"0923276856",
          abscent:0,
          late:false,
          permission:1,
          remark:"No remark",
          lateTime:""
        },{
          date:"2020-10-15T17:23:09.850Z",
          classRoomId:"5f74b6c8166e951ec4cc9351",
          studentId:"5f73319b790b6f11e86ea032",
          studentTelephone:"0923276856",
          abscent:true,
          late:false,
          permission:0,
          remark:"No remark",
          lateTime:""
        },{
          date:"2020-10-16T17:23:09.850Z",
          classRoomId:"5f74b6c8166e951ec4cc9351",
          studentId:"5f73319b790b6f11e86ea032",
          studentTelephone:"0923276856",
          abscent:0,
          late:false,
          permission:false,
          remark:"No remark",
          lateTime:""
        },{
          date:"2020-10-17T17:23:09.850Z",
          classRoomId:"5f74b6c8166e951ec4cc9351",
          studentId:"5f73319b790b6f11e86ea032",
          studentTelephone:"0923276856",
          abscent:0,
          late:false,
          permission:false,
          remark:"No remark",
          lateTime:""
        },{
          date:"2020-10-18T17:23:09.850Z",
          classRoomId:"5f74b6c8166e951ec4cc9351",
          studentId:"5f73319b790b6f11e86ea032",
          studentTelephone:"0923276856",
          abscent:0,
          late:false,
          permission:false,
          remark:"No remark",
          lateTime:""
        },{
          date:"2020-10-13T17:23:09.850Z",
          classRoomId:"5f74b6c8166e951ec4cc9351",
          studentId:"5f7330cbd5b3622e84071f08",
          studentTelephone:"0923276844",
          abscent:false,
          late:false,
          permission:0,
          remark:"No remark",
          lateTime:""
        },{
          date:"2020-10-14T17:23:09.850Z",
          classRoomId:"5f74b6c8166e951ec4cc9351",
          studentId:"5f7330cbd5b3622e84071f08",
          studentTelephone:"0923276844",
          abscent:true,
          late:false,
          permission:1,
          remark:"No remark",
          lateTime:""
        },{
          date:"2020-10-15T17:23:09.850Z",
          classRoomId:"5f74b6c8166e951ec4cc9351",
          studentId:"5f7330cbd5b3622e84071f08",
          studentTelephone:"0923276844",
          abscent:true,
          late:false,
          permission:0,
          remark:"No remark",
          lateTime:""
        },{
          date:"2020-10-16T17:23:09.850Z",
          classRoomId:"5f74b6c8166e951ec4cc9351",
          studentId:"5f7330cbd5b3622e84071f08",
          studentTelephone:"0923276844",
          abscent:0,
          late:false,
          permission:false,
          remark:"No remark",
          lateTime:""
        },{
          date:"2020-10-17T17:23:09.850Z",
          classRoomId:"5f74b6c8166e951ec4cc9351",
          studentId:"5f7330cbd5b3622e84071f08",
          studentTelephone:"0923276844",
          abscent:1,
          late:false,
          permission:false,
          remark:"No remark",
          lateTime:""
        },{
          date:"2020-10-18T17:23:09.850Z",
          classRoomId:"5f74b6c8166e951ec4cc9351",
          studentId:"5f7330cbd5b3622e84071f08",
          studentTelephone:"0923276844",
          abscent:1,
          late:false,
          permission:false,
          remark:"No remark",
          lateTime:""
        }]

        var attendanceColumnName = [
            {
            columnName: "2020-10-13",
            remark: "No remark"
            },
            {
            columnName: "2020-10-14",
            remark: "Fasika"
            },
            {
            columnName: "2020-10-15",
            remark: "Timket"
            },
            {
            columnName: "2020-10-16",
            remark: "No Remark"
            },
            {
            columnName: "2020-10-17",
            remark: "Nothing"
            },
            {
            columnName: "2020-10-18",
            remark: "Nothing"
            }]
        course.update({_id:"5f733239790b6f11e86ea043"},{$set:{attendance:attendanceObj, attendanceColumnName:attendanceColumnName}}).then((response)=>{
            callback(null,response)
        },(error)=>{callback(error)})
}
const UpdateMarkList = (changes, gubayeId, courseId, callback) => {
    course.findById(courseId).then((singleCourse)=>{
        changes.forEach((change)=>{
            singleCourse.markList.forEach((student)=>{
                if(student.studentId == change.userId && student.classRoomId == gubayeId)
                {
                    console.log(change.columnNumber)
                    if(change.columnNumber == 1)
                    {
                        student.column_1_value = change.value
                    }
                    else if(change.columnNumber == 2)
                    {
                        student.column_2_value = change.value
                    }
                    else if(change.columnNumber == 3)
                    {
                        student.column_3_value = change.value
                    }
                    else if(change.columnNumber == 4)
                    {
                        student.column_4_value = change.value
                    }
                    else if(change.columnNumber == 5)
                    {
                        student.column_5_value = change.value
                    }
                    else if(change.columnNumber == 6)
                    {
                        student.column_6_value = change.value
                    }
                    else if(change.columnNumber == 7)
                    {
                        student.column_7_value = change.value
                    }
                    else if(change.columnNumber == 8)
                    {
                        student.column_8_value = change.value
                    }
                    else if(change.columnNumber == 9)
                    {
                        student.column_9_value = change.value
                    }
                    else if(change.columnNumber == 10)
                    {
                        student.column_10_value = change.value
                    }

                }
            })  
        })
        singleCourse.save().then((notification)=>{
            callback(null, notification)
        })
    })
}

const addStudentToAttendanceList = (studentsArray, gubayeId, callback) =>{
    classRoom_modelAccessor.gubayeDetail(gubayeId,function(err,gubaye){
        gubaye.addedCourses.forEach((addedCourse)=> {
            course.findById(addedCourse.course_id).then((singleCourse)=>{
                singleCourse.attendance.findOne({studentId:student._id}).then((attendance)=>{
                    if(!attendance)
                    {
                        studentsArray.forEach((student)=> {
                            singleCourse.attendanceColumnName.forEach((column)=>{
                                if(column.classRoomId == gubayeId)
                                {
                                    singleCourse.attendance.push(
                                        {   
                                            date:column.columnName,
                                            classRoomId:gubayeId,
                                            studentId:student._id,
                                            studentTelephone:student.telephone,
                                            abscent:1,
                                            late:false,
                                            permission:false,
                                            remark:"",
                                            lateTime:""
                                        })
                                }
                            })
                        })
                        console.log(singleCourse)
                        singleCourse.save().then((notification)=>{
                            callback(null, notification)
                        }).catch((error)=>{callback(error, false)})
                    }
                })
            })
        })
})
}
const addStudent = (studentsArray, gubayeId, callback) => {
        console.log("addStudent Excuted!")
        var markList = []
        markList.pop();

        studentsArray.forEach((student)=> {
            markList.push(
            {    
            studentId:student._id,
            classRoomId:gubayeId,
            studentTelephone:student.telephone,
            column_1_value:"0",
            column_2_value:"0",
            column_3_value:"0",
            column_4_value:"0",
            column_5_value:"0",
            column_6_value:"0",
            column_7_value:"0",
            column_8_value:"0",
            column_9_value:"0",
            column_10_value:"0"}
            )
        })

        classRoom_modelAccessor.gubayeDetail(gubayeId,function(err,gubaye){
            console.log("gubaye")
            // Add the student to the database if the student does not exist in the database
            addStudentToAttendanceList(studentsArray,gubayeId,function(err, notifi){
                console.log(notifi) 
            })
            gubaye.addedCourses.forEach((addedCourse)=> {
                console.log("gubaye.addedCourses",gubaye.addedCourses)
                course.findById(addedCourse.course_id).then((singleCourse)=>{
                    singleCourse.markList.push(markList);
                    console.log("singleCourse.markList", singleCourse.markList)
                    singleCourse.save().then((notification)=>{
                        callback(null, notification)
                    }).catch((error)=>{callback(error, false)})
                    // .then((savedData)=>{callback(null,savedData)}).catch((err)=>{callback(err)})
                })
            })
})}

const addstudentsToCourse= (courses, gubayeId, callback) => {
    // determine students of the gubaye
    console.log(courses, gubayeId)
    classRoom_modelAccessor.gubayeDetail(gubayeId,function(err,gubaye){
        if(err)
        {
            callback(err)
        }
        else
        {

            var students=[]
            students.pop();
            gubaye.members.map((member)=>{
                students.push(member.memberId)
            })
            user_ModelAccessor.userObjectByTel(students,function(err,studentsProfile){
                var stu = [{_id:mOngoose.Schema.Types.ObjectId,  telephone:String}]
                stu.pop();
                studentsProfile.map((student)=>{
                    stu.push({_id:student._id.toString() ,telephone:student.telephone})
                })
                addStudentToMarkList(stu,courses,gubayeId,function(err,confirmation){
                    if(err)
                    {
                        callback(err)
                    }
                    else
                    {
                        addStudentToAttendanceList(stu,gubayeId,function(error,confirmation){
                    
                            callback(null,confirmation)
                        })
                    }
                })
    
            })
        }
    })
}

const addStudentToMarkList=(students,courses,gubayeId,callback)=>{
    // students should be an array of objects that contain student telephone and student Id
    courses.map((courseId)=>{
        var markList = []
        markList.pop();
        students.map((student)=>{
            markList.push(
                {    
                studentId:student._id,
                classRoomId:gubayeId,
                studentTelephone:student.telephone,
                column_1_value:"0",
                column_2_value:"0",
                column_3_value:"0",
                column_4_value:"0",
                column_5_value:"0",
                column_6_value:"0",
                column_7_value:"0",
                column_8_value:"0",
                column_9_value:"0",
                column_10_value:"0"}
                )
        })
        course.findById(courseId).then((singleCourse)=>{
            markList.map((ml)=>{
                singleCourse.markList.push(ml);
            })
            singleCourse.save().then((confirmation)=>{callback(null,confirmation)}).catch((err)=>{callback(err)});
        })
    })
}
// what happens when a new date is added to the system
// 1st  columnName and remark are added to attendanceColumnName object
// 2nd the added date is registered on each members of the class as anscent

addStudentToAttendanceList
const addAttendanceColumn = function(new_date, remark, classRoomId, courseId, callback)
{
    course.findById(courseId).then((singleCourse)=>{
        singleCourse.attendanceColumnName.push({columnName:new_date, remark:remark, classRoomId:classRoomId})
        var index = 0;
        singleCourse.markList.forEach((student) => {
            if(student.classRoomId == classRoomId)
            {
               newData = {
                    date:new_date,
                    classRoomId:classRoomId,
                    studentId:student.studentId,
                    studentTelephone:student.studentTelephone,
                    abscent:1,
                    late:false,
                    permission:false,
                    remark:"No remark",
                    lateTime:""
                  }
                  singleCourse.attendance.push(newData)
            }
            index = 1 + index;
        })
        singleCourse.save().then((savedData)=> {callback(null,savedData)}).catch((err)=>{callback(err)})
        
    }).catch((err)=>{callback(err)})
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
exports.upadteAttenance = upadteAttenance;
exports.addAttendanceColumn = addAttendanceColumn;

exports.addstudentsToCourse = addstudentsToCourse;
exports.createCourse = createCourse;
// exports.courseDetailPR = courseDetailPR;
exports.courseDetail = courseDetail;
exports.deleteCourse = deleteCourse;
exports.updateCourseDetail = updateCourseDetail;
exports.addCourse = addCourse;
exports.allCourses = allCourses;
exports.courseIds = courseIds;
exports.editCourse = editCourse;
exports.addStudent = addStudent;
exports.addStudentToAttendanceList = addStudentToAttendanceList
exports.addBook = addBook;
exports.booksByCourse = booksByCourse;
exports.deleteBook = deleteBook;
exports.populateAttendance = populateAttendance