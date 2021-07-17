courseCoutLineIframe = document.getElementById('courseOutlineIFrame')
fileUpload = document.getElementById("Cfile_upload")
removeBtn = document.getElementById("btnRemoveCourseOutline")
var socket = io('/course');
if(courseCoutLineIframe.src == "/null/")
{
fileUpload.style.display = "block";
courseCoutLineIframe.style.display = "none"
removeBtn.style.display = "none"
}
else
{
    removeBtn.style.display = "block"
    fileUpload.style.display = "none";
    courseCoutLineIframe.style.display = "block"
}
    var btnObj = {
        courseId : 0,
        removeCourseOutline: function() 
        {
          courseCoutLineIframe.src = ""
          courseCoutLineIframe.style.display = "none"
          fileUpload.style.display = "block";


          var btnRemoveCourseOutline = document.getElementById('btnRemoveCourseOutline')
          btnRemoveCourseOutline.style.display = 'none'
          socket.emit('removeCourseOutline',this.courseId)
          socket.on('removeCourseOutline',function(Confirmation){
              console.log(Confirmation);
          });

        }
    }
    
    function updateCourse()
    {    
        var courseName = document.getElementById("name").value;
        var description = document.getElementById("description").value
        var courseId = document.getElementById("_id").value
        socket.emit('updateCourseDetail',courseId, courseName, description)
        socket.on('updateCourseDetail',function(Confirmation){
            window.location.href = "/STB/SirateTimhert/course/nius_sebsabi/"+courseId;
        });
    }