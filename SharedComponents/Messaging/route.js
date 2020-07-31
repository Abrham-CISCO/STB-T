'use strict';
var mid = require('../Middlewares/index');
var express = require('express');
var router = express.Router();
var jsonParser = require('body-parser').json;
router.use(jsonParser());
var messaging = require('./model_Accessor');

router.get('/contacts/:tel',function(req,res){
    var Tel = req.params.tel;
    messaging.contactList(Tel,function(err,contactList){
        if(err)
        {
            res.json({
                err: err
            });
        }
        else
        {
            res.json({
                cont: contactList
            });
        }
    });
});

router.get('/historyOf/:memberTel', function(req,res){
    var MemberTel = req.params.memberTel;
   messaging.chatHistoryAll(MemberTel,function(err,History){
    if(err || !History){
        res.json({
            response: err
        });               
    } 
    else{
        res.json({
            response: History
        });
    }
   });
});


router.post('/sendMessage/:toTel/:domain', jsonParser(), function(req,res){

    var toTel = req.params.toTel;
    var fromTel = req.session.user.telephone;
    var Domain = req.params.domain;
    var messageBody = req.body.message;

    messaging.sendMessage(fromTel,toTel,Domain,messageBody,function(err, confirmation){
        if(err || !confirmation){
            res.json({
                response: err
            });               
        } 
        else{
            res.json({
                response: confirmation
            });
        }
    });
    });

module.exports = router;