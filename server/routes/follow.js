'use strict'

var express=require('express');
var api=express.Router();
var FollowController=require('../controllers/follow');
var md_auth=require ('../middelwares//authenticate');

api.post('/follow',md_auth.ensureAuth,FollowController.saveFollow);
api.delete('/follow_delete/:id',md_auth.ensureAuth,FollowController.deleteFollow);
api.get('/total_follow/:id/:page?',md_auth.ensureAuth,FollowController.getFollowingUsers);
api.get('/total_followed/:id/:page?',md_auth.ensureAuth,FollowController.getFollowedUsers);



module.exports=api;