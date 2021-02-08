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

exports.addCourse = addCourse;
exports.createGrade = createGrade;
exports.curriculumsSmallDetail = curriculumsSmallDetail;
exports.gradeDetail = gradeDetail;
exports.curriculumDetail = curriculumDetail;
exports.allCurriculums = allCurriculums;
exports.createCurriculum = createCurriculum;