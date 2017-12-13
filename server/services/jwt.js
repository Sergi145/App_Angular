'use strict'
const jwt=require ('jwt-simple');
const moment=require('moment');//saber la fecha de creacion y expiración del token
const secret='clave_secreta_social';

exports.createToken=function(user){//pasamos un objeto taller y lo guardamos en un hash para codificarlo

	var payload={//datos que se van a codificar

			sub:user._id,//guardamos el id del registro
			name:user.name,
			surname:user.surname,
			email:user.email,
			nick:user.nick,
			role:user.role,
			image:user.image,
			role:user.role,
			iat:moment().unix(),//fecha de creación del token actual
			exp:moment().add(30,'days').unix//expiración dentro de 30 dias

	}

		return jwt.encode(payload,secret)//devolvemos el token codificado y le pasamos una clave secreta
}
