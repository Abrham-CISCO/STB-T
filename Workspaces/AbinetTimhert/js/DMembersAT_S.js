var DepartmentID = 5;

function Load(){
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
  document.getElementById(DepartmentID).className = "nav-link active"
  var Output = "<div class='row d-flex align-items-stretch'>";
  ;
  if(xhr.readyState === 4){
    if(xhr.status === 200 )
    {
      var users = JSON.parse(xhr.responseText);
      for(var i = 0; i < users.response.length; i++)
      {
        for(var j = 0; j<10; j++)
        {
          if((users.response[i].work[0].subDepartment[j].active == true))
            {
              if((users.response[i].work[0].subDepartment[j].sd_id == DepartmentID)) {
                    
                Output += "<div class='col-12 col-sm-6 col-md-4 d-flex align-items-stretch'>";
                Output += "<div class='card bg-light'><div class='card-header text-muted border-bottom-0'>"
                Output += users.response[i].work[0].subDepartment[j].role;
                Output += "<div class='card-tools'></div></div>";
                Output += "<div class='card-body pt-0'><div class='row'><div class='col-7'><h2 class='lead'><b></b>"
                Output += users.response[i].name;
                Output += "</b></h2><p class='text-muted text-sm'><b>About: </b> Web Designer / UX / Graphic Artist / Coffee Lover </p><ul class='ml-4 mb-0 fa-ul text-muted'>"
                Output += "<li class='small'><span class='fa-li'><i class='fas fa-lg fa-envelope'></i></span> Email: "+users.response[i].email+"</li>"
                Output += "<li class='small'><span class='fa-li'><i class='fas fa-lg fa-phone'></i></span> Phone #: " + users.response[i].telephone +"</li>"
                Output += "</ul></div><div class='col-5 text-center'><img src='static/dist/img/user1-128x128.jpg' alt='' class='img-circle img-fluid'>"
                Output += "</div></div></div><div class='card-footer'><div class='text-right'><a href='#' class='btn btn-sm bg-teal'><i class='fas fa-comments' onclick = SendMessage('"+ users.response[i]._id +"')></i>"
                Output += "</a>&nbsp;<a href='#' class='btn btn-sm btn-primary' onclick = ViewProfile('"+ users.response[i]._id +"')><i class='fas fa-user'></i> View Profile"
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


xhr.open('GET','members/TK');
xhr.send();
}
Load();



function ViewProfile(ID)
{
  console.log(ID);
}
function Sendmessage(ID)
{
  console.log(ID);
}