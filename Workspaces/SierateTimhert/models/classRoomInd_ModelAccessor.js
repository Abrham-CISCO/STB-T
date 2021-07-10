var ClassRoomInd = require("./classRoomInd");

const newUser = function(userTelephone,callback)
{
    var newUserObject = {userTel:userTelephone};
    ClassRoomInd.create(newUserObject, function(error, user){
        if(error)
        {
            callback(error)
        }
        else
        {
            callback(null,user)
        }
    })
}

const NonMemberUsers = (groupID, callback) => {
    var nonMembers = []
    nonMembers.pop();
    var isMember = false;
    allUsers(function(error,user){
        for(var i = 0; i<user.length; i++)
        {
            isMember = false;
            for(var j=0; j<user[i].joinedClasses.length; j++)
            {
                if(user[i].joinedClasses[j].classID == groupID)
                {
                    isMember = true;
                }
            }
            if(isMember == false)
            {
                nonMembers.push(user[i])
            }

        }
        callback(null,nonMembers)
    })
}

const allUsers = function(callback)
{
    ClassRoomInd.find({})
        .exec(function(error,users)
        {
            if(error)
            {
                callback(error)
            }
            else
            {
                callback(null,users)
            }   
        });
}
const addARRYMemberToGroup = (userTelArray, groupID, callback) => {
    for(var i = 0; i<userTelArray.length; i++)
    {
        ClassRoomInd.AddMemberToGroup(userTelArray[i], groupID, function(error,user){
            if(error)
            {
                callback(error)
            }
        })        
    }
    
    callback(null,"Added")
}

const joinedClass = (userTelephone, callback) => {
    ClassRoomInd.find({userTel:userTelephone},function(error, user){
        if(error)
        {
            callback(error)
        }
        else
        {
            callback(null,user[0].joinedClasses)

        }
    })
}

const addMemberToGroup = (userTel, groupID, callback) => {
    ClassRoomInd.AddMemberToGroup(userTel, groupID, function(error,user){
        if(error)
        {
            callback(error)
        }
        else
        {
            callback(null,user)
        }
    })
}

const leaveGroup = (userTelephone, groupID, callback) => {
    ClassRoomInd.leave(userTelephone, groupID, function(error,user){
        if(error)
        {
            callback(error)
        }
        else
        {
            callback(null,user)
        }
    });
}


exports.addMemberToGroup = addMemberToGroup;
exports.newUser = newUser;
exports.addARRYMemberToGroup = addARRYMemberToGroup;
exports.allUsers = allUsers;
exports.NonMemberUsers = NonMemberUsers;
exports.joinedClass = joinedClass;
exports.leaveGroup = leaveGroup;