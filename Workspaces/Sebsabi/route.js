var express = require('express');
var router = express.Router();
var mid = require('../../SharedComponents/Middlewares/index');
var subDepartment = "Sebsabi";
var filePrefix = "Sebsabi";

var DepartmentAdminLink = "Workspaces/"+subDepartment+"/templates/" + filePrefix+"DA";
var SubDepartmentAdminLink = "Workspaces/"+subDepartment+"/templates/"+ filePrefix+"SDA";
var SubDepartmentMemberLink="Workspaces/"+subDepartment+"/templates/"+ filePrefix+"SDM";
// For Department Admins
router.get('/', mid.requireSignIn, mid.requiresToBeLeader, function(req,res,next){
    return res.render(DepartmentAdminLink,req.session.user);
});


module.exports = router;