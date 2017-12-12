'use strict'

var mongoose=require('mongoose');

mongoose.Promise=global.Promise;
var app=require('./app');

var port=3800;

//conexion base de datos

mongoose.connect('mongodb://localhost:27017/social_app',{useMongoClient:true})
	.then(()=>{

		console.log("la conexion a la base de datos se a relizado correctamente")
		//creamos el servidor

		app.listen(port,()=>{
			console.log('el servidor corriendo correctamente')
		})
	})
	.catch(err=>console.log(err));

