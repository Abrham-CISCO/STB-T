var classRoom = require('./classRoom')
var UserAccModelAcc = require('../../../Account/Models/user_model_accessor');

const gubayeDetail = (GubayeID, callback) => {
    classRoom.gubayeDetails(GubayeID, function(error,gubaye){
        callback(null,gubaye);
    });
}

const memberAdder = (gubayeID, Members, callback) => {
    classRoom.addMember(gubayeID,Members,function(error,response){
        if(!error){
            UserAccModelAcc.AddMemberToG(Members,gubayeID,function(error,response){
                if(!error)
                {
                    callback(null,response);
                }
            })
        }
    })
}

const createGubaye =  (gubayeName,gubayeDescription,callback) =>{
    var gubayeObject = {
        name: gubayeName,
        description:gubayeDescription,
        leader:"No One",
        members:[]
    }
    classRoom.create(gubayeObject, function(error, gubaye){
        if(error)
        {
            callback(error)
        }
        callback(null, gubaye)
    })
}

const Gubaeyat = (callback) => {
    classRoom.AllGubayeats(function(error, gubaeyat){
        callback(null,gubaeyat)
    })
}

const updateGubaye = (ClassRoomID, gubayeName, Description, leader, callback) => {
    classRoom.UpdateInfo(ClassRoomID, gubayeName, Description, leader, function(error, result){
        if(error)
        {
            callback(error)
        }
        else{
            callback(null,result)
        }
    })
}
const removeMem = (GubayeID,telephone,callback) =>
{
    classRoom.removeMember(GubayeID,telephone,function(error, gubaye){
        if(error)
        {
            callback(error)
        }
        else{
            callback(null,gubaye)
        }
    });
}
const deleteGubaye = (ClassRoomID, callback) => {
    classRoom.DeleteGubaye(ClassRoomID,function(error,result){
        if(error)
        {
            callback(error)
        }
        else{
            callback(null,result)
        }
    })
}
const IDArrayToNameArray = (IDArray,callback) => {
    classRoom.IDArrayToNameArray(IDArray,function(error, gubaeyat){
        console.log("CMA ", gubaeyat)
        if(error)
        {
            callback(error)
        }
        else{
            callback(null,gubaeyat)
        }
    })
}

exports.IDArrayToNameArray = IDArrayToNameArray;
exports.deleteGubaye = deleteGubaye;
exports.Gubaeyat = Gubaeyat;
exports.gubayeDetail = gubayeDetail;
exports.createGubaye = createGubaye;
exports.memberAdder = memberAdder;
exports.updateGubaye = updateGubaye;
exports.removeMem = removeMem;