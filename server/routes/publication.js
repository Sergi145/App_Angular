'use strict'

var express=require('express');
var api=express.Router();
var PublicationController=require('../controllers/publication');
var md_auth=require ('../middelwares/authenticate');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/users'})


api.post('/publication',md_auth.ensureAuth,PublicationController.savePublication);
api.get('/publications/:page?',md_auth.ensureAuth,PublicationController.getPublications);
api.get('/publication/:id',md_auth.ensureAuth,PublicationController.getPublication);
api.delete('/delete_publication/:id',md_auth.ensureAuth,PublicationController.deletePublication);
api.post('/upload-image-publication/:id',[md_auth.ensureAuth,md_upload],PublicationController.uploadImage);
api.get('/get_image_publication/:image_file',PublicationController.getImageFile);




module.exports=api;