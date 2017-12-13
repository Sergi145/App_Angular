'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt=require ('../services/jwt');
var mongoosePaginate=require('mongoose-pagination');
var fs=require('fs');


function saveUser(req, res) {

    var params = req.body;
    var user = new User();

    if (params.name && params.surname && params.nick && params.email && params.password) {

        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER',
            user.image = null;

        //controlamos usuarios duplicados
        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
            ]
        }).exec((err, users) => {

            if (err)
                return res.status(500).send({ message: 'Error en la peticion de usuarios' })
            if (users && users.length >= 1)
                return res.status(200).send({ message: 'El usuario que intentas registrar ya existe' })
            else {

                bcrypt.hash(params.password, null, null, (err, hash) => {

                    user.password = hash;

                    user.save((err, userStored) => {

                        if (err)
                            return res.status(500).send({ message: 'Error al guardar el usuario' })
                        if (userStored) {
                            res.status(200).send({ user: userStored })
                        } else {
                            res.status(404).send({ message: 'no se a registrado el usuario' })
                        }
                    })
                })


            }
        })


    } else {
        res.status(200).send({ message: 'Rellena todos los campos' })
    }

}

function loginUser(req, res) {

    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email}, (err, user) => {

            if (err)
                return res.status(500).send({ message: 'Error en la peticion' });
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {

                    if (check) {
                      
                        if(params.gettoken){
                        	//devolver token

                        	return res.status(200).send({token:jwt.createToken(user)})

                        }
                        else{
                        	 //devolver datos de usuario
                        	 user.password=undefined;
                        return res.status(200).send({user})
                        }
                       
                    } else
                        return res.status(404).send({ message: 'El usuario no se a podido logear' });

                })
            }
            else{
            	return res.status(404).send({ message: 'El usuario no se a podido identificar' });
            }
        
    })

}

function getUser(req, res) {

	var userId=req.params.id;

	User.findById(userId,(err,user)=>{

		if(err){

			 res.status(500).send({ message: 'Error en la petición' })

		}
			if(!user){

				res.status(404).send({ message: 'El usuario no existe' })

			}
		
			return res.status(200).send({user})
		
	})

}

function getUsers(req,res){


	var identity_user_id=req.user.sub;
	var page=1;

	if(req.params.page){

		var page=req.params.page;//como vamos a utilizar paginamiento creamos una variable page
	}
	
	var usersPerPage=10;//le decimos cada pagina cuantos usuarios listara

	User.find().sort('name').paginate(page,usersPerPage,(err,users,total)=>{//buscamos los clientes y lo ordenamos por nombre

		if(err)

			return  res.status(500).send({ message: 'Error en la petición' })

			if(!users)

			return res.status(404).send({ message: 'No hay usuarios' })

			
				return res.status(200).send({
					total:total,
					users:users,
					pages:Math.ceil(total/usersPerPage)
				})
			
	})

}

function updateUser(req,res){

	var userId=req.params.id;//conseguimos el id que nos llega por params

	var update=req.body;//recogemos todo los datos del body que llega por put

	delete update.password;

	if(userId!=req.user.sub)

  	return res.status(500).send({ message: 'no tienes permisos para actulizar los datos del usuario' })

	User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdated)=>{

		 if (err) 
            res.status(500).send({ message: 'Error al actualizar el usuario' })
        
       
             if (!userUpdated)  //si no existe el usuario

               return res.status(404).send({ message: 'No se a podido actualizar el usuario' })
            
    
              return  res.status(200).send({ user:userUpdated})
           
	})

}


function uploadImage(req,res){

      var userId=req.params.id;//recogemos el id


      if(req.files){
        var file_path=req.files.image.path;//path donde esta guardada la imagen
        var file_split=file_path.split('\\');//recortarmos el nombre
        var file_name=file_split[2];
        //console.log(file_split);

        var ext_split=file_name.split('\.')
        var file_ext=ext_split[1];//encontramos la extension de la foto
        console.log(file_ext);

         if(userId!=req.user.sub){
         		return removeFilesOfUploads(res,file_path,'no tienes permisos para actulizar los datos del usuario')
         }
  		

        if(file_ext==='png' || file_ext==='jpg' || file_ext==='gif'){

        	User.findByIdAndUpdate(userId,{image:file_name},{new:true},(err,userUpdated)=>{

        		 if (err) 
            res.status(500).send({ message: 'Error al actualizar el usuario' })
        
       
             if (!userUpdated)  //si no existe el usuario

               return res.status(404).send({ message: 'No se a podido actualizar el usuario' })
            
    
              return  res.status(200).send({ user:userUpdated})


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

	var image_file=req.params.imageFile;

	var path_file='./uploads/users/'+image_file;

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
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}