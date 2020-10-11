var registeredChanges = [
    {
        userId:String,
        columnNumber:Number,
        value:String
    }
]

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