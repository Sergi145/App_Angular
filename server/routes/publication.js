'use strict'

var express=require('express');
var api=express.Router();
var PublicationController=require('../controllers/publication');
var md_auth=require ('../middelwares/authenticate');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/users'})


api.post('/publication',md_auth.ensureAuth,PublicationController.savePublication);
api.get('/publications/:page?',md_auth.ensureAuth,PublicationController.getPublications);




module.exports=api;