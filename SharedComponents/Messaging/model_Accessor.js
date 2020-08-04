'use strict';
var MessagesM = require('../models/Message_model');
var userModelAccessor = require('../../Account/Models/user_model_accessor')


// Because the following function contains a callback function, its result can not be
// processed as normal functions do. this is because the output of the function occurs
// suddenly after the normal function completes excution. so the function shall be defined as
// call back function or promises should be used to halt processing until something is returned.
const createAccount =  (messageData,callback) =>{
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
            callback(error,null)
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
            callback(error,null)                
        } 
        else{
            callback(null,messages);
        }
     });
};

function RegisterMessage(Tel, FromTelephoneNumber,ToTelephoneNumber,Domain,MessageBody, callback){
    var MessageHistory;
    var repeat = 0;
    var toTel = ToTelephoneNumber;
    var fromTel = FromTelephoneNumber;
    var Domain = Domain;
    var messageBody = MessageBody.message;

    MessagesM.messageHistory(Tel,function(error, messages){
        if(error || !messages)
        {
            var err = new Error('Wrong telephone or password.');
            err.status = 401;
            return callback(err,null)
        } 
        else{
                MessageHistory = messages;
        }
        userModelAccessor.userDataByTel(fromTel,function(error,sender){
            userModelAccessor.userDataByTel(toTel,function(error,reciever){
                var MessageObject = {
                    fromName:sender.name,
                    fromID:fromTel,
                    toID:toTel,
                    toName:reciever.name,
                    body:messageBody,
                    domain:"Personal",
                    read:false
                };
                repeat += 1
            if(repeat < 2)
            {
                MessageHistory.History.push(MessageObject);
            }
                MessagesM.MessageAdder(Tel,MessageHistory.History, function(error, user){
                    if(error){
                        var err = new Error("Update failed!");
                        return callback(err,null)
                    }
                    return callback(null,"Message Sent")
                }); 
            });
        });
    });
}

const sendMessage =  (FromTelephoneNumber,ToTelephoneNumber,Domain, MessageBody,callback) =>{
    RegisterMessage(ToTelephoneNumber, FromTelephoneNumber,ToTelephoneNumber,Domain,MessageBody, function(error,confirmation){
        RegisterMessage(FromTelephoneNumber, FromTelephoneNumber,ToTelephoneNumber,Domain,MessageBody, function(error,confirmation){
            callback(null,"Message Sent");;
        });
    });
};

const messageNotification = (TelephoneNumber,callback) =>{
    // Load All Messages
    MessagesM.messageHistory(TelephoneNumber,function(error, messages){
        var Notification = [
            {
                name:String,
                telephone:String,
                message:String
            }
        ]
        Notification.pop();
        var Edit = false;
        var NotIndex = 0;    
        if(error || !messages){
            callback(error,null)                
        } 
        else{
            // Store last message per person as an object in an array
                // Separate recieved messages from sent messages
                var PureMessage = messages.History
                for(var i = 0;i<PureMessage.length;i++)
                {
                    if(PureMessage[i].toID == TelephoneNumber & PureMessage[i].fromID != TelephoneNumber)
                    {
                        for(var j=0; j<Notification.length;j++)
                        {
                            if(Notification[j].telephone == PureMessage[i].fromID)
                            {
                                Edit = true;
                                NotIndex = j;
                            }
                        }
                        if(Edit == true)
                        {
                            // Update the data
                            Notification[NotIndex].name = PureMessage[i].fromName
                            Notification[NotIndex].message = PureMessage[i].body
                            Edit = false;
                            NotIndex = 0;
                        }
                        else
                        {
                            // Add the data
                            Notification.push({name:PureMessage[i].fromName,telephone:PureMessage[i].fromID,message:PureMessage[i].body})
                        }
                    }
                }
            // Return the array object
            callback(null,Notification);
        }
     });
}
    exports.createAccount = createAccount; 
    exports.contactList = contactList;
    exports.chatHistoryAll = chatHistoryAll;
    exports.sendMessage = sendMessage;
    exports.messageNotification = messageNotification;