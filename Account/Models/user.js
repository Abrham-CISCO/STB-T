var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
    telephone: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    RegDate: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required : true
    },
    work: {
        type: Object,
        default: [
                  { 
                    // Possible Improvement : Instead of saving department links on the database. define these links somewhere else.
                    // Connect the departments with the link using s_id and parent relation
                    department:"ትምህርት ክፍል",
                    subDepartment:[
                        {name:"ሰብሳቢ",DA_link:"/Sebsabi",role:"ሰብሳቢ",active:true, sd_id:1, parent : 1},
                        {name:"ጸሐፊ",DA_link:"/Tsehafi/DepartmentAdmin",role:"ጸሐፊ",active:false, sd_id:2, parent : 1, SD_link:"/Tsehafi/SubDepartmentAdmin"},
                        {name:"ስርዓተ ትምህርት",DA_link:"/SirateTimhert/DepartmentAdmin",role:"ሰብሳቢ",active:false, sd_id:3,  parent : 1,SD_link:"/SitateTimhert/SubDepartmentAdmin",},
                        {name:"ስርዓተ ትምህርት",DA_link:"/SirateTimhert/DepartmentAdmin",role:"አባል",active:false, sd_id:3,  parent : 3,SD_link:"/SitateTimhert/SubDepartmentMember"},
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
    }
});

//Authenticate input against database documents
UserSchema.statics.authenticate = function(telephone, password, callback){
    console.log("tel : ", telephone);
    console.log("password : ", password);
    User.findOne({telephone: telephone})
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
    User.findOne({telephone:telephone})
        .exec(function(error, user){
            console.log(user);
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
    User.find({})
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
    User.findOne({_id:UserId})
        .exec(function(error, user){
            if(error){
            }
            else if(!user){
                var err = new Error("User Not Found");
                err.status = 401;
                return callback(err);
            }
            return callback(null,user);
        })
}
//hash password before saving to database
UserSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash){
        if (err){
            return next(err);
        }
        user.password = hash;
        console.log(hash);
        next();
    });
});

UserSchema.statics.editProfile = function(userID, UserGeneral, callback){
    User.updateOne({_id:userID}, {$set:{name:UserGeneral.name,email:UserGeneral.email,telephone:UserGeneral.telephone}})
        .exec(function(error,user){
            if(error){
                next(error);
            }
            else if(!user){
                var err = new Error("User Not Found");
                err.status = 401;
                return callback(err);
            }
            return callback(null,user)

        });
}

UserSchema.statics.updatePassword = function(userID, Password, callback){
    bcrypt.hash(Password, 10, function(err, hash){
        if (err){
            return next(err);
        }
        Hpassword = hash;
        console.log(Hpassword);
    User.updateOne({_id:userID}, {$set:{password:Hpassword}})
        .exec(function(error,user){
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
    });
}

UserSchema.statics.AssignRole = function(userID, UserWorkObject,  callback){
    User.updateOne({_id:userID},{$set:{work:UserWorkObject}})
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

var User = mongoose.model('User',UserSchema);
module.exports = User;