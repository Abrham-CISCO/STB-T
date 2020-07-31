PWD = require('../Models/PSDrecovery')

const register = (PWDData,callback) => 
{
    PWD.create(PWDData, function(error, pwd){
        if(error){
            callback(error,null)
        }
        else
        {
            callback(null,pwd)
        }
    });
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