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

exports.createCourse = createCourse;