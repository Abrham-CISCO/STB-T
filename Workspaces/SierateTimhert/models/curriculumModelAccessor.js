const course_ModelAccessor = require('./courseModelAccessor');
var curriculum = require("./curriculum")

const allCurriculums = (callback) => {
    curriculum.find({})
    .populate('curriculum.created_By').then((curriculums)=>{
        callback(null,curriculums);
    }).catch((err)=>{
        callback(err,false);
    })
}

const createCurriculum = (created_By,curriculumName, description, callback) => {
    curriculum.create({
        created_By:created_By,
        name:curriculumName,
        description:description
    }).then(response => callback(null, response)).catch((err)=>callback(err,false));
}

const curriculumDetail = (curriculumId, callback) => {
    curriculum.findById(curriculumId)
    .populate('curriculums.created_By').then((singleCurriculum)=>{
        console.log("singleCurriculum",singleCurriculum)
        callback(null,singleCurriculum)
    }).catch((err)=>{
        callback(err,false);
    })
}

const gradeDetail = (curriculumId, gradeId, callback) => {
    curriculum
    .findById(curriculumId).then((singleCurriculum)=>{
        var searchedGrade = singleCurriculum.grades.filter((grade)=>{
            return grade._id == gradeId
        })
        if(searchedGrade.length == 1)
        {
            callback(null, searchedGrade)
        }
        else
        {
            var err = new Error("Grade Not Found!")
            err.statusCode = 404;
            callback(err, false);
        }
    }).catch((err)=>{
        callback(err,false);
    })
}

const curriculumsSmallDetail = (callback) => {
    curriculum.find({}, {_id:true, name:true}).then((curriculums)=>{
        callback(null,curriculums)
    }).catch((err)=>{callback(err,false)});
}

const createGrade = (curriculum_id, created_By, gradeName, description, callback) => {
    curriculum.findById(curriculum_id).then(curriculum => {
        curriculum.grades.push({
            created_By:created_By,
            name:gradeName,
            description:description,
        })
        curriculum.save().then((resp)=>callback(false,resp)).catch((err)=>callback(err));
    })
}

const addCourse = (curriculum_id, grade_id,course_id, callback) => {
    var i=0;
    curriculum.findById(curriculum_id).then(curriculum => {
        curriculum.grades.forEach(grade => {
            if(grade._id == grade_id)
            {
                curriculum.grades[i].courses.push({
                    course_id:course_id
                })
            }
            i++
        });
        curriculum.save().then(editedCur=>callback(false,editedCur)).catch(err=>callback(err));
    })
}

const notAddedCoursesPerCurriculum = (curriculumId, callback) => {
    var courseAdded = false;
    var NAcourses = []; NAcourses.pop(), counter=0;
        curriculum.findById(curriculumId).then(singleCurriculum => {
            singleCurriculum.grades.forEach(grade => {
                    course_ModelAccessor.allCourses(function(err, allCourses){
                        console.log(allCourses);
                        for(var i =0; i<allCourses.length;i++)
                        {
                            singleCourse = allCourses[i];
                                grade.courses.forEach(gradeCourse => {
                                    if(singleCourse._id == gradeCourse.course_id)
                                    {
                                        courseAdded = true;
                                    }
                                });    
                                if(!courseAdded)
                                {
                                    NAcourses.push({grade_Id:grade._id,course_id:singleCourse._id, name:singleCourse.name})
                                }
                                courseAdded = false;
                                counter++;
                                if(singleCurriculum.grades.length * allCourses.length  == counter) 
                                {callback(null,NAcourses); break;};
                        }
                    })   
            });
        }).catch((err)=>callback(err))    
} 

// create a function that displays a course that is not added to a grade
// const notAddedCourses = (curriculumId, gradeId, callback) => {
//     var courseAdded = false;
//     var NAcourses = []; NAcourses.pop();
//         curriculum.findById(curriculumId).then(singleCurriculum => {
//             singleCurriculum.grades.forEach(grade => {
//                 // if(grade._id == gradeId)
//                 // {
//                     course_ModelAccessor.allCourses(function(err, allCourses){
//                         console.log("allCourses",allCourses)
//                         allCourses.forEach(singleCourse=>{
//                             grade.courses.forEach(gradeCourse => {
//                                 if(singleCourse._id == gradeCourse.course_id)
//                                 {
//                                     courseAdded = true;
//                                 }
//                             });    
//                             if(!courseAdded)
//                             {
//                                 NAcourses.push({grade_Id:"grade._id",course_id:singleCourse._id, name:singleCourse.name})
//                             }
//                             courseAdded = false;
//                         })
//                         callback(null,NAcourses);
//                     })   
//                 // }
//             });
//         }).catch((err)=>callback(err))
// }

exports.notAddedCoursesPerCurriculum = notAddedCoursesPerCurriculum;
// exports.notAddedCourses = notAddedCourses;
exports.addCourse = addCourse;
exports.createGrade = createGrade;
exports.curriculumsSmallDetail = curriculumsSmallDetail;
exports.gradeDetail = gradeDetail;
exports.curriculumDetail = curriculumDetail;
exports.allCurriculums = allCurriculums;
exports.createCurriculum = createCurriculum;

