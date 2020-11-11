courseCoutLineIframe = document.getElementById('courseOutlineIFrame')
fileUpload = document.getElementById("Cfile_upload")
removeBtn = document.getElementById("btnRemoveCourseOutline")
console.log(courseCoutLineIframe.src)
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
        first : 0,
        removeCourseOutline: function() 
        {
          courseCoutLineIframe.src = ""
          courseCoutLineIframe.style.display = "none"
          fileUpload.style.display = "block";


          var btnRemoveCourseOutline = document.getElementById('btnRemoveCourseOutline')
          btnRemoveCourseOutline.style.display = 'none'
          
        }
    }
    
    // // Front end design using object Oriented programming and closure
    // class sampleClass
    // {
    //     constructor(params) {
            
    //     }
    // }

    // class MemberCard
    // {
    //     constructor(name,_Id,phone,email,membershipStatus)
    //     {
    //         name = this.name;
    //         Id = this.Id;
    //         phone = this.phone;
    //         email = this.email;
    //         membershipStatus = this.membershipStatus;
    //     }
    // }

    // var AbrhamGetachew = new MemberCard("Abrham Getachew", "0084","0923276844","abrhamcisco@gmail.com","none")
    // // closure is created now
    // function add(x)
    // {
    //     return function(y)
    //     {
    //         return x + y
    //     }
    // }
    // var y = add(1)(2);