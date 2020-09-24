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
    course.findById(courseId).then(function(error, courseDetails)
    {callback(null, courseDetails)}).catch(function(error){callback(error)});
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

exports.createCourse = createCourse;
// exports.courseDetailPR = courseDetailPR;
exports.courseDetail = courseDetail;
exports.deleteCourse = deleteCourse;
exports.updateCourseDetail = updateCourseDetail;

exports.addBook = addBook;
exports.booksByCourse = booksByCourse;
exports.deleteBook = deleteBook;
