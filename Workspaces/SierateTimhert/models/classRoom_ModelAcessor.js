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
        members:[
                {memberId:"0923276844"},
                {memberId:"0911675507"}
        ]
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
exports.Gubaeyat = Gubaeyat;
exports.gubayeDetail = gubayeDetail;
exports.createGubaye = createGubaye;
exports.memberAdder = memberAdder;