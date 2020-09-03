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
    socket.emit('GubayeMembers',gubayeID,members);
//   window.location.href = "http://localhost:3000/SirateTimhert/Gubaye_Nius_Sebsabi/"+gubayeID;

}


