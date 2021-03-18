function addmembers(gubayeID)
{
    var socket = io('/gubaye');
    var members = [];
    members.pop();
    var selectionConut = document.getElementsByClassName("select2-selection__rendered")[0].childNodes.length - 1;
    for(var i = 0; (i<selectionConut); i++)
    {
        members.push(document.getElementsByClassName("select2-selection__rendered")[0].childNodes[i].title)
        
    }
    socket.emit('AddGubayeMembers',gubayeID,members);
  socket.on('AddGubayeMembers',function(Confirmation){
    window.location.href = "/STB/SirateTimhert/Gubaye_Nius_Sebsabi/"+gubayeID;
  });
}

function assignCurriculum(gubayeID)
{
    var socket = io('/curriculum');
    var curriculumName;
    curriculumName = document.getElementsByClassName("select2-selection__rendered")[1].innerText.trim();
    console.log("'",curriculumName,"'");
    socket.emit('addCurriculum',curriculumName.trim(), gubayeID);
    
}

function addCourse(gubayeID)
{
    var socket = io('/gubaye');
    var courses = [];
    courses.pop();
    var selectionConut = document.getElementsByClassName("select2-selection__rendered")[1].childNodes.length - 1;
    for(var i = 0; (i<selectionConut); i++)
    {
        courses.push(document.getElementsByClassName("select2-selection__rendered")[1].childNodes[i].title)  
    }
    socket.emit('AddGubayeCourses',gubayeID,courses);
  socket.on('AddGubayeCourses',function(Confirmation){
    window.location.href = "/STB/SirateTimhert/Gubaye_Nius_Sebsabi/"+gubayeID;
  });
}

function updateGubaye()
{
  var socket = io('/gubaye');
  var GubayeName = document.getElementById("name").value;
  var description = document.getElementById("description").value
  var admin = document.getElementById("admin").value
  var classId = document.getElementById("_id").value
  socket.emit('UpdateGubaye',classId, GubayeName, description, admin)
  socket.on('UpdateGubaye',function(Confirmation){
    window.location.href = "/STB/SirateTimhert/Gubaye_Nius_Sebsabi/"+classId;
  });
}
function deleteGubaye()
{
  // Before Deleting the group, prompt the user to make sure they know what they do
  var socket = io('/gubaye');
  var classId = document.getElementById("_id").value
  socket.emit('deleteGubaye',classId)
  socket.on('deleteGubaye',function(Confirmation){
    window.location.href = "/STB/SirateTimhert/SubDepartmentAdmin"
  });
}