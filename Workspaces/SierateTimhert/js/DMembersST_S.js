var DepartmentID = 3;
var MembersName =[];
var MembersID=[];

function Load(){
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
  document.getElementById(DepartmentID).className = "nav-link active"
  NotLeader = [];
  NotMember = [];
  if(xhr.readyState === 4){
    if(xhr.status === 200 )
    {
      var users = JSON.parse(xhr.responseText);
      console.log(users);
      var Output ="<div class='row d-flex align-items-stretch'>";
      MembersName = [];
      MembersID = [];
      var userStatus;
      for(var i = 0; i < users.response.length; i++)
      {
        for(var j = 0; j<10; j++)
        {
          if((users.response[i].work[0].subDepartment[j].active == true))
            {
              if(users.response[i].work[0].subDepartment[j].parent == 1)
              {
                userStatus = 1
              }
              else
              {
                userStatus = 0
              }
              if((users.response[i].work[0].subDepartment[j].sd_id == DepartmentID)) {
                    
                Output += "<div class='col-12 col-sm-6 col-md-3 d-flex align-items-stretch'>";
                Output += "<div class='card bg-light'><div class='card-header text-muted border-bottom-0'>"
                Output += users.response[i].work[0].subDepartment[j].role;
                Output += "<div class='card-tools'></div></div>";
                Output += "<div class='card-body pt-0'><div class='row'><div class='col-7'><h2 class='lead'><b></b>"
                Output += users.response[i].name;
                MembersName.push(users.response[i].name);
                MembersID.push(users.response[i].telephone);
                Output += "</b></h2><ul class='ml-4 mb-0 fa-ul text-muted'>"
                Output += "<li class='small'><span class='fa-li'><i class='fas fa-lg fa-envelope'></i></span> ኢሜል: "+users.response[i].email+"</li>"
                Output += "<li class='small'><span class='fa-li'><i class='fas fa-lg fa-phone'></i></span> ስልክ ቁጥር: " + users.response[i].telephone +"</li>"
                Output += "</ul></div><div class='col-5 text-center'><img src='" + users.response[i].pro_img +"' alt='' class='img-circle img-fluid'>"
                Output += "</div></div></div><div class='card-footer'><div class='text-right'>"
                // Output += "<button onclick = LoadChatBox('"+ users.response[i].telephone +"') class='btn btn-sm bg-teal'><i class='fas fa-comments' ></i></button>&nbsp;"
                Output += "<a href='/STB/accounts/public/profile/"+users.response[i].telephone+"' class='btn btn-sm btn-primary')><i class='fas fa-user'></i>  መግለጫ እይ"
                Output += "</a></div></div></div></div>"
                }
            }
        }
    }
    Output += "</div>"
document.getElementById("userlist").innerHTML = (Output);
    } else if (xhr.status === 404) {
       //file not found
    } else if (xhr.status === 500) {
       //server had a problem
    }
  }
};


xhr.open('GET','/STB/accounts/all');
xhr.send();
}
Load();
function Assign(UserType)
{

  var UserID;
  var CandidatesList = document.getElementById("OPT");
  for(var m=0; m<CandidatesList.length; m++)
  {
    if (CandidatesList.options[m].selected == true)
    {
      UserID = (CandidatesList.options[m].id);
    }
  }
  
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
  
  if(xhr.readyState === 4){
    if(xhr.status === 200 ){
      Load();
    } else if (xhr.status === 404) {
       //file not found
    } else if (xhr.status === 500) {
       //server had a problem
    }
  }
  }  


  if (UserType == 1)
  {
    link = "/STB/accounts/add/"+DepartmentID+"/Leader/"+UserID;
    xhr.open('GET',link);
    xhr.send();
  
  }
  if (UserType == 0)  
  {
  link = "/STB/accounts/add/"+DepartmentID+"/Member/"+UserID;
  xhr.open('GET',link);
  xhr.send();
  }
};
function SendMessage(ID)
{
for(var i = 0; i<MembersID.length; i++)
{
  if(ID == MembersID[i])
  {
    MessageboxDisplay(ID, MembersName[i]);  
  }
}
}

// Function for creating a group
// Type of method to be used : POST
// Object to be posted : {gname:"Gubaye Name"}

function CreateClass()
{
  var socket = io('/gubaye');
  className = document.getElementById("gname").value;
  socket.emit('CreateGubaye',className);
  console.log(className)
  
  socket.on('CreateGubaye',function(Confirmation){
    alert(Confirmation);
    window.location.href = "/SirateTimhert/SubDepartmentAdmin";
  });
}