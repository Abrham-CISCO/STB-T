'use strict';
var mid = require('../Middlewares/index');
var express = require('express');
var router = express.Router();
var MessagesM = require('../models/Message_model');
var jsonParser = require('body-parser').json;

router.use(jsonParser());

const createAccount =  (messageData) =>{
    MessagesM.create(messageData, function(error, MSG){
        if(error){
            return next(error);
        }
        else
        {
            return res.render('Account/templates/profile',user);
        }
    });
}

router.get('/contacts/:tel',function(req,res){
    var Tel = req.params.tel;
    MessagesM.contact(Tel,function(error, contacts){
        if(error||!contacts)
        {
            var err = new Error("No contacts for this user");
            err.status = 401;
            return next(err);
        }
        else
        {
            res.json({
                cont: contacts
            });
        }
    });
});

router.get('/historyOf/:memberTel',mid.requireSignIn, function(req,res){
    var MemberTel = req.params.memberTel;
    MessagesM.messageHistory(MemberTel,function(error, messages){
        if(error || !messages){
            var err = new Error('Wrong telephone or password.');
            err.status = 401;
            return next(err);                
        } 
        else{
            res.json({
                response: messages
            });
        }
     });
});


router.post('/sendMessage/:toTel/:domain/',mid.requireSignIn, jsonParser(), function(req,res){

    var toTel = req.params.toTel;
    var fromTel = req.session.user.telephone;
    var Domain = req.params.domain;
    var messageBody = req.body.message;
    var MessageHistory;

    function RegisterMessage(Tel){
        MessagesM.messageHistory(Tel,function(error, messages){
            if(error || !messages)
            {
                var err = new Error('Wrong telephone or password.');
                err.status = 401;
                return next(err);                
            } 
            else{
                    MessageHistory = messages;
            }
         var MessageObject = {
                fromID:fromTel,
                toID:toTel,
                body:messageBody,
                domain:Domain,
                read:false
         };
    
         MessageHistory.Messages.push(MessageObject);
         MessagesM.MessageAdder(Tel,MessageHistory.Messages, function(error, user){
            if(error){
                var err = new Error("Update failed!");
            }
        });
        });
    }
    RegisterMessage(toTel);
    RegisterMessage(fromTel);
    res.send("DONE");
    });

    module.exports = router;