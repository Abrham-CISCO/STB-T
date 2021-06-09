var express = require('express');
var router = express.Router();
var mid = require('../../SharedComponents/Middlewares/index');

// For Department Admins
router.get('/DepartmentAdmin', mid.requireSignIn, mid.requiresToBeLeader, function(req,res,next){
    return res.render('Workspaces/AbinetTimhert/templates/AbnetTDA',req.session);
});

// For Sub Department Admins
router.get('/SubDepartmentAdmin', mid.requireSignIn,mid.requiresToBeSTKNS, function(req,res,next){
    return res.render('Workspaces/AbinetTimhert/templates/AbnetTSDA',req.session);
});

// For Sub Department Members
router.get('/SubDepartmentMember', mid.requireSignIn,mid.requiresToBeSTKNA, function(req,res,next){
    return res.render('Workspaces/AbinetTimhert/templates/AbnetTSDM',req.session);
});

module.exports = router;