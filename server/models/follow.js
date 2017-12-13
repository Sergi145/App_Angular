'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var FollowSchema=Schema({
	user_id:{type:Schema.ObjectId,ref:'User'},
	followed_id:{type:Schema.ObjectId,ref:'User'}
})


module.exports=mongoose.model('Follow',FollowSchema);