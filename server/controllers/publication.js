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
	
	var publicationsPerPage=4;//le decimos cada pagina cuantos usuarios listara

	Follow.find({user_id:req.user.sub}).populate('followed_id').exec((err,follows)=>{//buscamos los clientes y lo ordenamos por nombre

		if(err)

		return  res.status(500).send({ message: 'Error en la petición' })

		var follows_clean=[];

		follows.forEach((follow)=>{


			follows_clean.push(follow.followed_id)
		})



		Publication.find({user_id:{"$in":follows_clean}}).sort('created_at').populate('user_id').paginate(page,publicationsPerPage,(err,publications,total)=>{

				if(err)

				return  res.status(500).send({ message: 'Error en la petición' })

				if(!publications)

					return  res.status(404).send({ message: 'No hay publicaciones' })

				  return res.status(200).send({ 
				   	total_items:total,
				   	publications,
				   	page,
				   	pages:Math.ceil(total/publicationsPerPage) 
				   })



		})
			
	})
		
}


function getPublication(req,res){

	var publication_id=req.params.id;


	Publication.findById(publication_id,(err,publication)=>{

			if(err)

			return  res.status(500).send({ message: 'Error en la petición' })

			if(!publication)

			return  res.status(404).send({ message: 'No existe la publicacion' })

			  return res.status(200).send({ 
				 publication
				   })

	});


}

function deletePublication(req,res){

	var publication_id=req.params.id;

	Publication.find({'user_id':req.user.sub,'_id':publication_id}).remove(err=>{//solo puede borrar la persona que a creado la publicación

		if(err)
			return  res.status(500).send({ message: 'Error en la petición' })

		//if(!publicationRemoved)

			//return  res.status(404).send({ message: 'No se a borrado la publicacion' })

			  return res.status(200).send({ 
				 message:'publicacion eliminada correctamente'
				   })


	})

}


function uploadImage(req,res){

      var publicationId=req.params.id;//recogemos el id


      if(req.files){
        var file_path=req.files.image.path;//path donde esta guardada la imagen
        var file_split=file_path.split('\\');//recortarmos el nombre
        var file_name=file_split[2];
        //console.log(file_split);

        var ext_split=file_name.split('\.')
        var file_ext=ext_split[1];//encontramos la extension de la foto
        console.log(file_ext);


      
       		
        if(file_ext==='png' || file_ext==='jpg' || file_ext==='gif'){

        	Publication.findByIdAndUpdate(publicationId,{file:file_name},{new:true},(err,publicationUpdated)=>{

        		 if (err) 
            res.status(500).send({ message: 'Error al actualizar el usuario' })
        
       
             if (!publicationUpdated)  //si no existe el usuario

               return res.status(404).send({ message: 'No se a podido actualizar el usuario' })
            
    
              return  res.status(200).send({ publicationUpdated})


        	})
              
        }
        else{
        	return removeFilesOfUploads(res,file_path,'Extension no valida')
        }
    }
    else{
    	return res.status(200).send({message:'no se han subido las imagnes'})
    }

  }

 function removeFilesOfUploads(res,file_path,message){

    	fs.unlink(file_path,(err)=>{

    		return res.status(200).send({message})

    	})
}

function getImageFile(req,res){

	var imagefile=req.params.image_file;

    console.log(imagefile)

	var path_file='./uploads/users/'+imagefile;

    console.log(path_file);

	fs.exists(path_file,(exists)=>{
		if(exists){
			res.sendFile(path.resolve(path_file))
		}
		else{
			res.status(200).send({message:'No existe la imagen'})
		}
	})
}


module.exports = {
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile 
}

