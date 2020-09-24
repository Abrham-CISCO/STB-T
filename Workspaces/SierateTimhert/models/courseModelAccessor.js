var course = require('./course');

const createCourse = function(name, description, callback)
{
    var courseObject = {
        name:name,
        description:description
    }
    course.create(courseObject).then((error,newCourse) => {
        if(error)
        {
            return callback(error)
        }
        else
        {
            return callback(null, newCourse)
        }})
}
const courseDetail = function(courseId,callback)
{
    course.findById(courseId).then(function(error, courseDetails)
    {callback(null, courseDetails)}).catch(function(error){callback(error)});
}

const courseDetailPR = new Promise((successFunction, failureFunction)=>{
    course.findById(courseId).then(
        function(error, courseDetails)
            {
                successFunction(courseDetails)
            }).catch(
                    function(error)
                    {
                        failureFunction(error)
                    });
}):

const updateCourseDetail = function(courseId, inputObject, callback)
{
    course.findById(courseId).then((courseDetails)
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
    
}

const DeleteMarkListByClassroomAndStudent = (courseId, classRoomId, studentId, callback) =>
{
    
}
const DeleteMarkListByStudent = (studentId, callback) =>
{
    
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
// Marklist Sub-docuement - create, edit, remove, read
exports.MarkListByClassRoom = MarkListByClassRoom;
exports.MarkListByStudent = MarkListByStudent;
exports.UpdateMarkList = UpdateMarkList;
// Attendance Sub-docuement - create, edit, remove, read


exports.createCourse = createCourse;
exports.courseDetailPR = courseDetailPR;
exports.courseDetail = courseDetail;
exports.deleteCourse = deleteCourse;
exports.updateCourseDetail = updateCourseDetail;

exports.addBook = addBook;
exports.booksByCourse = booksByCourse;
exports.deleteBook = deleteBook;
