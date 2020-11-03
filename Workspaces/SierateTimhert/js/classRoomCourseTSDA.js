var registeredChanges = [
    {
        userId:String,
        columnNumber:Number,
        value:String
    }
]

var registeredAttAbscentChange = [{
    userId:String,
    att_id:String,
    abscent:Boolean
}]

registeredAttAbscentChange.pop();

registeredChanges.pop()
function registerChanges(userId, coulumnNumber, value)
{
var registerBool = true;
var index=0, excIndex=0;
    // if the same field changed twice only single entity should be saved
    registeredChanges.forEach((myRegistry)=>{
        if(myRegistry.userId == userId & myRegistry.columnNumber == coulumnNumber)
        {

            // registeredChanges.slice(index,1)
            registerBool = false
            excIndex = index
        }
        index += 1
    })
    if(registerBool)
    {
        registeredChanges.push({userId:userId,columnNumber:coulumnNumber,value:value})
    }
    else
    {
        // the same user the same column should not be added but edited
        registeredChanges[excIndex]= {userId:userId,columnNumber:coulumnNumber,value:value}
    }
    console.log(registeredChanges);
}

function save(courseId, gubayeId)
{
    var socket = io('/course');
    socket.emit('updateCourse',registeredChanges, courseId, gubayeId);

    socket.on('updateCourse',function(Confirmation){
        alert(Confirmation);
        var url = "http://localhost:3000/SirateTimhert/course/Gubaye_Nius_Sebsabi/"+courseId+"/"+gubayeId;
        window.location.href = url
      });
}

function registerAttAbscentChanges(userId, att_id, abscent)
{
    var registerBool = true;
    var index=0, excIndex=0;
        // if the same field changed twice only single entity should be saved
        registeredAttAbscentChange.forEach((myRegistry)=>{
            if(myRegistry.userId == userId & myRegistry.att_id == att_id)
            {
                registerBool = false
                excIndex = index
            }
            index += 1
        })
        if(registerBool)
        {
            registeredAttAbscentChange.push({userId:userId,att_id:att_id,abscent:abscent})
        }
        else
        {
            // the same user the same column should not be added but edited
            registeredAttAbscentChange[excIndex]= {userId:userId,att_id:att_id,abscent:abscent}
        }
        console.log(registeredAttAbscentChange);
}

function saveAttAbscent(courseId, gubayeId)
{
    var socket = io('/course');
    socket.emit('updateAttendance',registeredAttAbscentChange, courseId, gubayeId);

    socket.on('updateAttendance',function(Confirmation){
        console.log(Confirmation);
        var url = "http://localhost:3000/SirateTimhert/course/Gubaye_Nius_Sebsabi/"+courseId+"/"+gubayeId;
        window.location.href = url
      });
}