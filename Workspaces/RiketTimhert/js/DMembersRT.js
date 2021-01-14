var DepartmentID = 6;
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
      var Output = "<div class='form-group' data-select2-id='29'><label>አዲስ አባል ይጨምሩ</label>"
      Output += "<table style='width: 100%'><tr><td><select id='OPT' class='form-control select2 select2-hidden-accessible' style='width: 100%;' data-select2-id='1' tabindex='-1' aria-hidden='true'>"
      NotLeader = [];
      NotMember = [];
      for(var i = 0; i < users.response.length; i++)
      {        
        for(var j = 0; j<10; j++)
        {
          if(((users.response[i].work[0].subDepartment[j].sd_id == DepartmentID & users.response[i].work[0].subDepartment[j].parent == 1  & users.response[i].work[0].subDepartment[j].active == false)))
            {   
                NotLeader.push(users.response[i]);
            }
            else if (users.response[i].work[0].subDepartment[j].active == false & users.response[i].work[0].subDepartment[j].parent == DepartmentID)
            {
                NotMember.push(users.response[i]);
            }
        }
    }
    for(var k = 0; k<NotLeader.length;k++){
      for(var l = 0; l < NotMember.length; l++)
      {
        if(NotLeader[k]._id == NotMember[l]._id)
        {
          Output += "<option id='"+NotLeader[k].telephone+"'>"
          Output += NotLeader[k].name;
          Output += "</option>"
        }
      }
    }
      Output += "</select><span class='select2 select2-container select2-container--default select2-container--below select2-container--focus' dir='ltr' data-select2-id='2' style='width: 100%;'>";
      Output += "<span class='dropdown-wrapper' aria-hidden='true'></span></span></td><td width = 50>";
      Output += "<button onclick = 'Assign(1);' type='button' class='btn btn-block btn-primary'><table><tr><td><i class='fas fa-plus'></i></td><td>&nbsp;ሰብሳቢ</td></tr>";
      Output += "</table></button></td><td width = 50><button type='button' onclick = 'Assign(0);' class='btn btn-block btn-primary'><table><tr><td><i class='fas fa-plus'></i></td><td>&nbsp;አባል</td></tr></table></td></tr></table>";
      Output += "</div>"
      Output += "<div class='row d-flex align-items-stretch'>";
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
                Output += "<div class='card-tools'><button type='button' onclick = RemoveMember('"+ users.response[i].telephone +"',"+userStatus+"); class='btn btn-tool' data-card-widget='remove'><i class='fas fa-times'></i></button></div></div>";
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
                Output += "<a href='/accounts/public/profile/"+users.response[i].telephone+"' class='btn btn-sm btn-primary')><i class='fas fa-user'></i>  መግለጫ እይ"
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
      console.log(UserType);
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


function RemoveMember(ID, UserType)
{
  var UserID = ID;
  
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
    link = "/STB/accounts/remove/"+DepartmentID+"/Leader/"+UserID;
    console.log(link);
    xhr.open('GET',link);
    xhr.send();
    console.log(link)
    window.location.href = "/STB/RiketTimhert/DepartmentAdmin";
  }
  if (UserType == 0)  
  {
    link = "/STB/accounts/remove/"+DepartmentID+"/Member/"+UserID;
    console.log(link);
    xhr.open('GET',link);
    xhr.send();
    window.location.href = "/STB/RiketTimhert/DepartmentAdmin";  
  }
}
function ViewProfile(ID)
{
  console.log(ID);
  
}
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

