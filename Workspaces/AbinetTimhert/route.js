var express = require('express');
var router = express.Router();
var mid = require('../../SharedComponents/Middlewares/index');

// For Department Admins
router.get('/DepartmentAdmin', mid.requireSignIn, mid.requiresToBeLeader, function(req,res,next){
    return res.render('Workspaces/AbinetTimhert/templates/AbnetTDA',req.session.user);
});

// For Sub Department Admins
router.get('/SubDepartmentAdmin', mid.requireSignIn, function(req,res,next){
    return res.render('Workspaces/AbinetTimhert/templates/AbnetTSDA',req.session.user);
});

// For Sub Department Members
router.get('/SubDepartmentMember', mid.requireSignIn, function(req,res,next){
    return res.render('Workspaces/AbinetTimhert/templates/AbnetTSDM',req.session.user);
});

module.exports = router;