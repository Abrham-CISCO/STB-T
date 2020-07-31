'use strict';
var MessagesM = require('../models/Message_model');


// Because the following function contains a callback function, its result can not be
// processed as normal functions do. this is because the output of the function occurs
// suddenly after the normal function completes excution. so the function shall be defined as
// call back function or promises should be used to halt processing until something is returned.
var createAccount =  (messageData,callback) =>{
    let oerror,oMSG,Status;
    MessagesM.create(messageData, function(error, MSG){
        if(error){
            callback(error,null);
        }
        else
        {
            callback(null,MSG);
        }
    });
}

const contactList =  (TelephoneNumber,callback) =>{
    MessagesM.contact(TelephoneNumber,function(error, contacts){
        if(error||!contacts)
        {
            var err = new Error("No contacts for this user");
            err.status = 401;
            callback(err,null)
        }
        else
        {
            callback(null,contacts);
        }
    });
};

const chatHistoryAll =  (TelephoneNumber,callback) =>{
    MessagesM.messageHistory(TelephoneNumber,function(error, messages){
        if(error || !messages){
            var err = new Error('Wrong telephone or password.');
            err.status = 401;
            callback(err,null)                
        } 
        else{
            callback(null,contacts);
        }
     });
};

const sendMessage =  (FromTelephoneNumber,ToTelephoneNumber,Domain, MessageBody,callback) =>{

    var toTel = ToTelephoneNumber;
    var fromTel = FromTelephoneNumber;
    var Domain = Domain;
    var messageBody = MessageBody;
    var MessageHistory;

    function RegisterMessage(Tel){
        MessagesM.messageHistory(Tel,function(error, messages){
            if(error || !messages)
            {
                var err = new Error('Wrong telephone or password.');
                err.status = 401;
                callback(err,null)
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
                callback(err,null)
            }
        });
        });
    }
    RegisterMessage(toTel);
    RegisterMessage(fromTel);
    callback(null,"Message Sent");;
};

    exports.createAccount = createAccount; 
    exports.contactList = contactList;
    exports.chatHistoryAll = chatHistoryAll;
    exports.sendMessage = sendMessage;