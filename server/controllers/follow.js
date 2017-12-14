'use strict'

var mongoosePaginate=require('mongoose-pagination');

var User=require('../models/user');
var Follow=require('../models/follow');

function saveFollow(req, res) {

    var params = req.body;
    var follow = new Follow();

    follow.user_id=req.user.sub;
    follow.followed_id=params.followed;

    follow.save((err,followStored)=>{

    	if(err)
    	return res.status(500).send({message:'Error al guardar el seguimiento'})

    	if(!followStored)
		return res.status(404).send({message:'El siguimienro no se a guardado'})

		return res.status(200).send({follow:followStored})    		


    });

 
}


function deleteFollow(req,res){

	var userId=req.user.sub;
	var followId=req.params.id;

	Follow.find({'user_id':userId,'followed_id':followId}).remove(err=>{

		if(err)
    	return res.status(500).send({message:'Error al dejar de seguir'})

    	return res.status(200).send({message:'El follow se a eliminado'})    		

	})
}




module.exports={
	saveFollow,
	deleteFollow
}

