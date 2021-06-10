var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var passportLocalMongoose = require('passport-local-mongoose');
var passport = require('passport');
var autoNumber = require('mongoose-auto-number')

var ClassRoomSchema = new mongoose.Schema({
class_ID:{type:String,required:true},
name:{type:String,default:"ጉባኤ"}
});
var UserSchema = new mongoose.Schema({
    telephone: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    STB_ID:{type:Number,autoIncreament:true},
    RegDate: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required : true
    },
    sex: {
        type:Object,
        default: {male:true, female:false}
    },
    name: {
        type: String,
        required : true
    },
    cname: {
        type: String,
        required : true
    },
    skipPassword:{type:Boolean,default:false},
    classRoom:[ClassRoomSchema],
    work: {
        type: Object,
        default: [
                  { 
                    // Possible Improvement : Instead of saving department links on the database. define these links somewhere else.
                    // Connect the departments with the link using s_id and parent relation
                    department:"ትምህርት ክፍል",
                    subDepartment:[
                        {name:"ሰብሳቢ",DA_link:"/Sebsabi",role:"ሰብሳቢ",active:false, sd_id:1, parent : 1},
                        {name:"ጸሐፊ",DA_link:"/Tsehafi/DepartmentAdmin",role:"ጸሐፊ",active:false, sd_id:2, parent : 1, SD_link:"/Tsehafi/SubDepartmentAdmin"},
                        {name:"ስርዓተ ትምህርት",DA_link:"/SirateTimhert/DepartmentAdmin",role:"ሰብሳቢ",active:false, sd_id:3,  parent : 1,SD_link:"/SirateTimhert/SubDepartmentAdmin",},
                        {name:"ስርዓተ ትምህርት",DA_link:"/SirateTimhert/DepartmentAdmin",role:"አባል",active:false, sd_id:3,  parent : 3,SD_link:"/SirateTimhert/SubDepartmentMember"},
                        {name:"መምህራን ምደባ",DA_link:"/MemihranMideba/DepartmentAdmin",role:"ሰብሳቢ",active:false, sd_id:4,  parent : 1,SD_link:"/MemihranMideba/SubDepartmentAdmin"},
                        {name:"መምህራን ምደባ",DA_link:"/MemihranMideba/DepartmentAdmin",role:"አባል",active:false, sd_id:4,  parent : 4 ,SD_link:"/MemihranMideba/SubDepartmentMember"},
                        {name:"የአብነት ትምህርት",DA_link:"/AbinetTimehert/DepartmentAdmin",role:"ሰብሳቢ",active:false, sd_id:5 , parent : 1,SD_link:"/AbinetTimehert/SubDepartmentAdmin"},
                        {name:"የአብነት ትምህርት",DA_link:"/AbinetTimehert/DepartmentAdmin",role:"አባል",active:false, sd_id:5,  parent : 5 ,SD_link:"/AbinetTimehert/SubDepartmentMember"},
                        {name:"የርቀት ትምህርት",DA_link:"/RiketTimhert/DepartmentAdmin",role:"ሰብሳቢ",active:false, sd_id:6 , parent : 1,SD_link:"/RiketTimhert/SubDepartmentAdmin"},
                        {name:"የርቀት ትምህርት",DA_link:"/RiketTimhert/DepartmentAdmin",role:"አባል",active:false, sd_id:6,  parent : 6 ,SD_link:"/RiketTimhert/SubDepartmentMember"}
                    ] 
                  }
                ]
                  
    },
    role: {
        type: String,
        default: "ገና አልተመደበም"
    },
    ChatSocketID: {
        type: String,
    },
    pro_img: { 
        type: String,
        default: "../Account/static/maleAvatar.png"
    }
},{timestamps:true});

UserSchema.pre('save', function(next){
    var user = this;
    if(user.pro_img == "../Account/static/maleAvatar.png")
    {
        if(user.sex.male == false)
        {
            user.pro_img = "../Account/static/femaleAvatar.png"
            next();
        }
        else
        {
            next();
        }
    }
    else
    {
        next()
    }
});

// Chat socket tools
    UserSchema.statics.getChatSocketID = function(telephone, callback){
        User.findOne({telephone: telephone},{hash:false, salt:false})
            .exec(function(error,user){
                if(error){
                    return callback(error);
                } else if ( !user ) {
                    var err = new Error('User not found.');
                    err.status = 401;
                    return callback(err);
                }
                return callback(null,user.ChatSocketID)            
            })
    }
    UserSchema.statics.setChatSocketID = function(telephone,SocketID, callback){
        User.updateOne({telephone:telephone},{$set:{ChatSocketID:SocketID}})
            .exec(function(error,notification){
                if(error)
                {
                    return callback(error,null)
                }
                callback(null,notification)
            })
    }
//Authenticate input against database documents
UserSchema.statics.authenticate = function(telephone, password, callback){
    User.findOne({telephone: telephone},{hash:false, salt:false})
        .exec(function(error,user){
            if(error){
                return callback(error);
            } else if ( !user ) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password,user.password, function(error, result){
              if(result === true){
                  return callback(null, user);
              } else
              {
                  return callback();
              }
            })
        });
}

//based on an inputted telehphone determine the username
UserSchema.statics.IDentifyUserName = function(telephone,callback){
    User.findOne({telephone:telephone},{hash:false, salt:false})
        .exec(function(error, user){
            if(error){
                return callback(error);
            } else if (!user){
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            return callback(null, user);
        });
}

//based on an inputted telehphone determine the username
UserSchema.statics.UserByTelephone = function(telephone,callback){
    User.findOne({telephone:telephone},{hash:false, salt:false})
        .exec(function(error, user){
            if(error){
                return callback(error);
            } else if (!user){
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            return callback(null, user);
        });
}

UserSchema.statics.Allusers = function(callback){
    User.find({},{hash:false, salt:false})
        .exec(function(error, user){
            if(error){

            } else if(!user){
                var err = new Error("No entries found.");
                err.status = 401;
                return callback(err);
            }
            return callback(null,user);
        });
}
UserSchema.statics.UserById = function(UserId, callback){
    User.findOne({_id:UserId},{hash:false, salt:false})
        .exec(function(error, user){
            if(error){
            }
            else if(!user){
                var err = new Error("User Not Found");
                err.status = 401;
                err.message = "User Not Found : From Model";
                return callback(err);
            }
            return callback(null,user);
        })
}

UserSchema.statics.UserObjByTelephone = function(telephoneArray, callback){

    var searchObj = {
        $or: [
            ]
        }
    for(var i = 0; i<telephoneArray.length; i++)
    {
        searchObj.$or.push({telephone:telephoneArray[i]})
    }
    User.find(searchObj,{name:true,telephone:true,pro_img:true})
        .exec(function(error, user){
            if(error){
                callback(error)
            }
            else if(!user){
                var err = new Error("User Not Found");
                err.status = 401;
                err.message = "User Not Found : From Model";
                return callback(err);
            }
            return callback(null,user);
        })
}

UserSchema.statics.NameArrayToTelephoneArray = function(nameArray, callback){

    var searchObj = {
        $or: [
            ]
        }

    for(var i = 0; i<nameArray.length; i++)
    {
        searchObj.$or.push({name:nameArray[i]})
    }
    User.find(searchObj,{telephone:true})
        .exec(function(error, user){
            if(error){
                callback(error)
            }
            else if(!user){
                var err = new Error("User Not Found");
                err.status = 401;
                err.message = "User Not Found : From Model";
                return callback(err);
            }
            return callback(null,user);
        })
}

UserSchema.statics.editProfile = function(userID, UserGeneral, callback){
    User.updateOne({_id:userID}, {$set:{name:UserGeneral.name,email:UserGeneral.email}})
        .exec(function(error,user){
            if(error){
                next(error);
            }
            else if(!user){
                var err = new Error("User Not Found");
                err.status = 401;
                return callback(err);
            }
            // should return the user
            return callback(null,user)

        });
}

UserSchema.statics.updatePassword = function(userID, Password, callback){
    User.findById((userID)).then((user)=>{
        user.setPassword(Password,function(err, user){
            if(err)
            {
                callback(err)
            }
            else
            {
                user.save();
                callback(null,user)
            }
        })
    }).catch((err)=>callback(err,false))
}

UserSchema.statics.AssignRole = function(UserTelephone, UserWorkObject,  callback){
    User.updateOne({telephone:UserTelephone},{$set:{work:UserWorkObject}})
    .exec(function(error, user){
        if(error){
            next(error);
        }
        else if(!user){
            var err = new Error("User Not Found");
            err.status = 401;
            return callback(err);
        }
        return callback(null,user);
    });
}

// Add memeber to a group // Accepts Array
UserSchema.statics.addMember = function(telephoneArray, groupID, groupName, callback)
{
    var searchObj = {
        $or: [
            ]
        }
    for(var i = 0; i<telephoneArray.length; i++)
    {
        searchObj.$or.push({telephone:telephoneArray[i]})
    }
    User.find(searchObj,{classRoom:true,_id:false})
    .exec(function(error, user){
        if(error){
            callback(error)
        }
        else if(!user){
            var err = new Error("User Not Found");
            err.status = 401;
            err.message = "User Not Found : From Model";
            return callback(err);
        }
        for(var i =0; i<user.length;i++)
        {
            user[i].classRoom.push({Class_ID:groupID})
        }
        for(var i =0; i<user.length;i++)
        {
            User.findOne({telephone:telephoneArray[i]},{hash:false, salt:false})
            .exec(function(error,user){
                user.classRoom.push({class_ID:groupID})
                // skip the password do not save it.
                user.skipPassword = true;
                user.save();
            })
        }
        callback(null,"notification")

    })
}

UserSchema.statics.uploadProfilePic = function(userId, img,callback){
    User.findById(userId).then(USER=>{
        USER.pro_img = img;
        console.log("img", USER.pro_img)
        USER.save().then(response=>{
            console.log("img", response.pro_img)
            callback(null,response)
        }).catch(err=>callback(err,false))
    }).catch(err=>callback(err,false))
}

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(autoNumber.plugin,'User')

User = mongoose.model('User',UserSchema);
module.exports = User 
