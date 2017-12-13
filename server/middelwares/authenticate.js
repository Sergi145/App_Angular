'use strict'
const jwt=require ('jwt-simple');
const moment=require('moment');//saber la fecha de creacion y expiración del token
const secret='clave_secreta_social';

//creamos un metodo para permitir comprobar si los datos son correctos del token que nos llega

exports.ensureAuth=function(req,res,next){

	if(!req.headers.authorization)//si nos nos llega la cabecera
		
		return res.status(403).send({message:'La petición no tiene la cabecera de autenticación'})


	const token=req.headers.authorization.replace(/['"]+/g,'')//recogemos authorizacion y le quitamos las comillas que vienen del token

		try{	//desocificamos el token

			var payload=jwt.decode(token,secret)

			if(payload.exp<=moment().unix())//si la fecha de experacion es menor que la actual, es decir si a pasado entonces...
			{
				return res.status(401).send({message:'El token a expirado'})
			}

		}		
		catch(error){
			console.error(error)
			return res.status(404).send({message:'El token no es valido'})
		}

		req.user=payload;//aqui introducimos todo los datos del usuario

		next();//salimos del middlewares				
}