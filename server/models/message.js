'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var MessageSchema=Schema({
	text:String,
	created_at:String,
	emitter_id:{type:Schema.ObjectId,ref:'User'},
	receiver_id:{type:Schema.ObjectId,ref:'User'},
})


module.exports=mongoose.model('Message',MessageSchema);