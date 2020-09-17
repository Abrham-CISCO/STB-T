var passport = require('passport')
var User = require('./Models/user')
var LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy({usernameField: 'telephone', passwordField:'password'}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());