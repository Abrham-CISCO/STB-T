var mongoose = require('mongoose');
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
    }
});

UserSchema.statics.UserByID = function(UserID,callback){
    User.findOne({ID:UserID})
    .exec(function(error,user){
        if (error){
            return callback(error);
        } else if(!user)
        {
            var err = new Error('User not found.');
            err.status = 401;
            return callback(err);
        }
        return callback(null, user);        
    });
};

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
    User.find()
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

var User = mongoose.model('User',UserSchema);
module.exports = User;
