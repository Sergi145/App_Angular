'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt=require ('../services/jwt');


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




module.exports = {
    saveUser,
    loginUser
}