var express = require('express');
var router = express.Router();
var mid = require('../Middlewares/index')
var NotificationModuleAccessor = require('./model_Accessor')
router.get('/load/:tel', function(req,res){
    var telephone = req.params.tel;
    NotificationModuleAccessor.createNotification(telephone, function(error,user){
        console.log(user)
        res.json(user)
    })
});
module.exports = router;