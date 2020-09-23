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
    
}
// Every model accessor should has document creating, removing, editing and deleting methods
exports.createCourse = createCourse;
exports.courseDetailPR = courseDetailPR;
exports.courseDetail = courseDetail;
