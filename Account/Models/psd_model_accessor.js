const PWD = require('../Models/PSDrecovery')
const nodemailer = require('nodemailer');
const user_ModelAccessor = require('./user_model_accessor')
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'timhertkifilportal@gmail.com',
    pass: 'TK-Meskel-2013'
  }
});


const register = (PWDData,callback) => 
{


  user_ModelAccessor.userData(PWDData.uID, function(error,user){
    
      var mailOptions = {
                        from: 'timhertkifilportal@gmail.com',
                        to: user.email,
                        subject: 'አምደ ተዋህዶ ሰ/ቤት ትምህርት ክፍል Portal : Password recovery Number',
                        text: '123456789'
                        };
        PWD.create(PWDData, function(error, pwd){
        if(error){
            callback(error,null)
        }
        else
        {
            callback(null,pwd)
//             Write here an instruction that sends the secret string to the user
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                callback(error);
              } else {
                
              }
            });
        }
    });
  })
}

const verify = (TUI,vcode,callback) => 
{
    PWD.verifyIdentity(TUI,vcode, function(error,response){
        if(error || !response){
            if(error)
            {
                var err = new Error('An Error has occured!');
                err.status = 401;
                return callback(err,null);    
            }
            if(!response)
            {
                var err = new Error('Invalid Code!');
                err.status = 401;
                return callback(err,null);                
            }
        }
        else
        {
            callback(null,response);
        } 
    });
}

exports.register = register;
exports.verify = verify;
