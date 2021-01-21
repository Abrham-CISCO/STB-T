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
    window.location.href = "/STB/SirateTimhert/Gubaye_Nius_Abal/"+gubayeID;
  });
}
function updateGubaye()
{
  var socket = io('/gubaye');
  var GubayeName = document.getElementById("name").value;
  var description = document.getElementById("description").value
  var classId = document.getElementById("_id").value
  socket.emit('UpdateGubaye_ForMember',classId, GubayeName, description)
  socket.on('UpdateGubaye_ForMember',function(Confirmation){
    window.location.href = "/STB/SirateTimhert/Gubaye_Nius_Abal/"+classId;
  });
}