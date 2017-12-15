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


function getFollowingUsers(req,res){

	var userId=req.user.sub;

	if(req.params.id){

		userId=req.params.id
	}

	var page=1;

	if(req.params.page){

		page=req.params.page
	}

	var followsPerPage=10;//le decimos cada pagina cuantos usuarios listara

	Follow.find({user_id:userId}).populate({path:'followed_id'}).paginate(page,followsPerPage,(err,follows,total)=>{//buscamos los clientes y lo ordenamos por nombre

		if(err)

			return  res.status(500).send({ message: 'Error en la petición' })

			if(!follows)

			return res.status(404).send({ message: 'No estas siguiendo a ningun usuario' })

			
				return res.status(200).send({
					total:total,
					follows:follows,
					pages:Math.ceil(total/followsPerPage)
				})
			
	})
}


function getFollowedUsers(req,res){

	var userId=req.user.sub;

	if(req.params.id){

		userId=req.params.id
	}

	var page=1;

	if(req.params.page){

		page=req.params.page
	}

	var followedPerPage=10;//le decimos cada pagina cuantos usuarios listara

	Follow.find({followed_id:userId}).populate('user_id').paginate(page,followedPerPage,(err,follows,total)=>{//buscamos los clientes y lo ordenamos por nombre

		if(err)

			return  res.status(500).send({ message: 'Error en la petición' })

			if(!follows)

			return res.status(404).send({ message: 'No te sigue ningun usuario' })

			
				return res.status(200).send({
					total:total,
					follows:follows,
					pages:Math.ceil(total/followedPerPage)
				})
			
	})
}



module.exports={
	saveFollow,
	deleteFollow,
	getFollowingUsers,
	getFollowedUsers
}

