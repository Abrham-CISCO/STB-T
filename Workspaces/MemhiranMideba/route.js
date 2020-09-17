var express = require('express');
var router = express.Router();
var mid = require('../../SharedComponents/Middlewares/index');
var subDepartment = "MemhiranMideba";
var filePrefix = "MemhranM";

var DepartmentAdminLink = "Workspaces/"+subDepartment+"/templates/" + filePrefix+"DA";
var SubDepartmentAdminLink = "Workspaces/"+subDepartment+"/templates/"+ filePrefix+"SDA";
var SubDepartmentMemberLink="Workspaces/"+subDepartment+"/templates/"+ filePrefix+"SDM";
// For Department Admins
router.get('/DepartmentAdmin', mid.requireSignIn, mid.requiresToBeLeader, function(req,res,next){
    return res.render(DepartmentAdminLink,req.session);
});

// For Sub Department Admins
router.get('/SubDepartmentAdmin', mid.requireSignIn, function(req,res,next){
    return res.render(SubDepartmentAdminLink,req.session);
});

// For Sub Department Members
router.get('/SubDepartmentMember', mid.requireSignIn, function(req,res,next){
    return res.render(SubDepartmentMemberLink,req.session);
});

module.exports = router;