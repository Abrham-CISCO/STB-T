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
    alert(Confirmation);
    window.location.href = "http://localhost:3000/SirateTimhert/Gubaye_Nius_Sebsabi/"+gubayeID;
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
    alert(Confirmation);
    window.location.href = "http://localhost:3000/SirateTimhert/Gubaye_Nius_Sebsabi/"+classId;
  });
}
function deleteGubaye()
{
  // Before Deleting the group, prompt the user to make sure they know what they do
  var socket = io('/gubaye');
  var classId = document.getElementById("_id").value
  socket.emit('deleteGubaye',classId)
  socket.on('deleteGubaye',function(Confirmation){
    alert(Confirmation);
    window.location.href = "http://localhost:3000/SirateTimhert/SubDepartmentAdmin"
  });
}