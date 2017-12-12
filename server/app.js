'use strict'

var express=require ('express');
var bodyParser=require('body-parser');

var app=express();

//cargamos las rutas


//cargamos los middlewares

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//rutas

app.get('/pruebas',(req,res)=>{
	res.status(200).send({

		message:'Accion de pruebas en el servidor de nodejs'
	})
})


//exportar

module.exports=app;