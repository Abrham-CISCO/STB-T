var passport = require('passport')
var User = require('./Models/user')
var LocalStrategy = require('passport-local').Strategy

// JSON Web token authentication strategy 
var JwtStrategy = require('passport-jwt').Strategy;

// Extracts JSON Web token from different sources
var ExtractJwt = require('passport-jwt').ExtractJwt

// Creates JSON Web tokens
var jwt = require('jsonwebtoken');

// JSON web token configurations
var config = require('./config');

exports.local = passport.use(new LocalStrategy({usernameField: 'telephone', passwordField:'password'}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user)
{
    return jwt.sign(user, config.secretKey, 
        {expiresIn: 3600})
}

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, function(jwt_payload, done){
    console.log("JWT payload: ", jwt_payload);
    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if(err) 
        {
            return done(err, false);
        }
        else if (user)
        {
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    })
}))

exports.verifyUser = passport.authenticate('jwt', {session:false})