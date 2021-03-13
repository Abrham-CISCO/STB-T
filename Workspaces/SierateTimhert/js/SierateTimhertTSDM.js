const { countOfTKMembers } = require("../../../Account/Models/user_model_accessor");
const curriculum = require("../models/curriculum");

function addCourseToGrade(curriculumId,gradeId)
{
  // The function of this function is to construct an array that contain list of selected 
  // courses (identified by course_Id), and send it to the server along with the curriculum Id, control_ID 
  // and grade ID. the back end logic will then add the courses and redirect the front end to display 
  // the newly added courses.
  //The control ID is used to identify the source of the data
  //The control ID can be gradeId + "_CTRL"

  var socket = io('/curriculum');
  var courses = [];
  var fullString, gradeName, courseName, splitted;
  courses.pop();
  var selectionConut;
  var gradeCount = document.getElementsByClassName("select2-selection__rendered").length;
  for(var i = 0; i < gradeCount; i++)
  {
    selectionConut = document.getElementsByClassName("select2-selection__rendered")[i].childNodes.length;
    if(selectionConut > 1)
    {
      for(var j = 0; (j<selectionConut); j++)
      {
        fullString = document.getElementsByClassName("select2-selection__rendered")[i].childNodes[j].title.toString();
        if(fullString != "")
        {
          splitted = fullString.split(" : ");
          gradeName = splitted[0]; 
          courseName = splitted[1];
          courses.push(
            {
              gradeName:gradeName,
              courseName:courseName
            })
        }
      }
    }
  }
  socket.emit('addCourse',curriculumId,gradeId,courses);
  socket.on('addCourse',function(Confirmation){
    window.location.href = "/STB/SirateTimhert/curriculum/"+curriculumId;
  });
}

// function addCourse(curriculumId, gradeId)
// {
//     var socket = io('/gubaye');
//     var courses = [];
//     courses.pop();
//     var selectionConut = document.getElementsByClassName("select2-selection__rendered")[1].childNodes.length - 1;
//     for(var i = 0; (i<selectionConut); i++)
//     {
//         courses.push(document.getElementsByClassName("select2-selection__rendered")[1].childNodes[i].title)
        
//     }
//     socket.emit('AddGubayeCourses',gubayeID,courses);
// }