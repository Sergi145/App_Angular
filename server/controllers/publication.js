'use strict'

var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');
var mongoosePaginate=require('mongoose-pagination');
var moment=require('moment');
var fs=require('fs');
const path = require('path');


function savePublication(req,res){

	 var params = req.body;
	
	 if (!params.text) 
		return res.status(200).send({ message: 'Tienes que enviar un texto' })

 	var publication = new Publication();

 	publication.text=params.text;
 	publication.file='null';
 	publication.created_at=moment().unix();
 	publication.user_id=req.user.sub;



 	publication.save((err, publicationStored) => {

        if (err)
           return res.status(500).send({ message: 'Error al guardar la publicación' })
             if (publicationStored) {
                res.status(200).send({ publication: publicationStored })
                 } else {
                  res.status(404).send({ message: 'no se a registrado la publicacion' })
                        }
          })
	   
}



function getPublications(req,res){


	var identity_user_id=req.user.sub;
	var page=1;

	if(req.params.page){

		var page=req.params.page;//como vamos a utilizar paginamiento creamos una variable page
	}
	
	var usersPerPage=4;//le decimos cada pagina cuantos usuarios listara

	Follow.find({user:req.user.sub}).populate('followed_id').exec((err,follows)=>{//buscamos los clientes y lo ordenamos por nombre

		if(err)

		return  res.status(500).send({ message: 'Error en la petición' })

		var follows_clean=[];

		follows.forEach((follow)=>{


			follows_clean.push(follow.followed_id)
		})

		console.log(follows_clean);
			
	})

}



module.exports = {
    savePublication,
    getPublications 
}

