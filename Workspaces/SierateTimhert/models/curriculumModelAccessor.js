const { response } = require('express');
const course_ModelAccessor = require('./courseModelAccessor');
const classRoom_ModelAccessor = require('./classRoom_ModelAcessor');
var curriculum = require("./curriculum");
const e = require('express');

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
    .then((singleCurriculum)=>{
        callback(null,singleCurriculum)
    }).catch((err)=>{
        callback(err,false);
    })
}

const detailedCurriculumDetail = (curriculumId, callback) => {
    course_ModelAccessor.allCourses(function(err,allCourses){
        if(!err && allCourses)
        {
            curriculum.findById(curriculumId)
            .then((singleCurriculum)=>{
                singleCurriculum.grades.forEach(grade=>{
                    grade.courses.forEach(course => {
                        allCourses.forEach(courseWithDetail=>{
                            if(course.course_id == courseWithDetail._id)
                            {
                                course.course_name=courseWithDetail.name;
                            }
                        })
                    })
                })
                callback(null,singleCurriculum);
            }).catch((err)=>{
                callback(err,false);
            })
        }
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
                                    if(grade._id == null) grade._id = "";
                                    NAcourses.push({grade_id:grade._id,course_id:singleCourse._id, name:singleCourse.name})
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

//create a function that adds a course to a grade of a specific curriculum
const addCourseToGrade = (curriculumId, gradeId, courses, callback) => {
    //Extract the id only from the courses array
    var courses_name = [];
    courses_name.pop();
    courses.forEach(course=>{
        courses_name.push(course.courseName)
    })
    curriculum.findById(curriculumId).then(singleCurriculum => {
        singleCurriculum.grades.forEach(grade=>{
            // Convert course name to id
            if(grade._id == gradeId)
            {
                course_ModelAccessor.courseIds(courses_name,function(err, detail)
                {
                    detail.forEach(courseId=>{
                        grade.courses.push({
                            course_id:courseId,
                            order:0,
                        });    
                    })
                    singleCurriculum.save().then(resp => {
                        callback(null,singleCurriculum)
                    })
                })
            }
        })
    }).catch(err=>callback(err,false))
} 
const changeCourseStatus = (curriculumId, gradeId, course_id, callback) => {
    curriculum.findById(curriculumId).then(singleCurriculum=>{
        singleCurriculum.grades.forEach(grade=>{
            if(grade._id == gradeId)
            {
                grade.courses.forEach(course=>{
                    if(course.course_id = course_id)
                    {
                        course.activated = !course.activated;
                        singleCurriculum.save();
                        callback(null, singleCurriculum);
                    }
                })
            }
        })
    })
}

const editGrade = (curriculumId, gradeId, gName, gDescription, callback) => {
    curriculum.findById(curriculumId).then(singleCurriculum=>{
        singleCurriculum.grades.forEach(grade=>{
            if(grade._id == gradeId)
            {
                grade.name = gName
                grade.description = gDescription;
                singleCurriculum.save().then(resp=>callback(null,resp),err=>callback(err,false));
            }
    })
})}

const addCurriculumToGubaye = (curriculumId, gubayeId, callback) => {
//Check if there already curriculum is assigned.
    classRoom_ModelAccessor.gubayeDetail(gubayeId,function(err,gubayeDetail){
        if(gubayeDetail.curriculum == "none")
        {
            curriculum.findById(curriculumId).then(singleCurriculum=>{
                var course_ids = []; course_ids.pop();
                singleCurriculum.courses.forEach(course=>{
                    course_ids.push(course.course_id)
                })
                classRoom_ModelAccessor.addCourse(gubayeId, course_ids, function(error, gubaye)
                {
                    if(error)
                    {
                    console.error(error)
                    }
                    else{
                    Course_ModelAccessor.addstudentsToCourse(course_ids,gubayeId,function(err,confirmation){
                        classRoom_ModelAccessor.assignCurriculumToGubaye(curriculumId,gubayeId, function(erro, reponse){
                            singleCurriculum.gubayeat.push({id:gubayeId});
                            singleCurriculum.save();
                            callback(null, confirmation)
                        })
                    })
                    }
                })
            })
        }
        else
        {
            var err = new Error("Alerady assigned!");
            err.message = "Alerady assigned!";
            callback(err,false);
        }
    })

}

const curriculumByName = (curriculumName,callback) => {
    // curriculum.findOne({name:curriculumName}).then((singleCurriculum)=> {
    //     console.log(curriculumName);
    //     callback(null, singleCurriculum);
    // }).catch((err)=>callback(err,false));
    allCurriculums(function(err,currs){
        currs.forEach(singleCurriculum=>{
            console.log(singleCurriculum.name,"==", "'",curriculumName.trim(),"'",">",singleCurriculum.name == curriculumName);
            if(singleCurriculum.name == curriculumName){
                console.log(singleCurriculum.name);
            callback(null, singleCurriculum);        
            }
        })    
    })
}

exports.curriculumByName = curriculumByName;
exports.addCurriculumToGubaye = addCurriculumToGubaye;
exports.editGrade = editGrade;
exports.changeCourseStatus = changeCourseStatus;
exports.addCourseToGrade = addCourseToGrade;
exports.notAddedCoursesPerCurriculum = notAddedCoursesPerCurriculum;
exports.addCourse = addCourse;
exports.createGrade = createGrade;
exports.curriculumsSmallDetail = curriculumsSmallDetail;
exports.gradeDetail = gradeDetail;
exports.curriculumDetail = curriculumDetail;
exports.allCurriculums = allCurriculums;
exports.createCurriculum = createCurriculum;
exports.detailedCurriculumDetail = detailedCurriculumDetail;