import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {UploadService} from '../../services/upload.service';
import {GLOBAL} from '../../services/global';



@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers:[UserService,UploadService]//aqui introducimos los servicios que necesitamos
})
export class UserEditComponent implements OnInit {

	public user:User;
	public status:string;
  public identity;//lleva el objeto del usuario identificado
  public token;//lleva el token
  public url:string;


  constructor(

  		private _route:ActivatedRoute,
  		private _router:Router,
    	private _userService:UserService,//injectamos el servicio para poder utilizarlo
      private _uploadService:UploadService
  	) {

  		this.user=this._userService.getIdentity();
  		this.token=this._userService.getToken();
  		this.identity=this.user;
      this.url=GLOBAL.url;
  }

  ngOnInit() {
  	
  }

  onSubmit()
  {
    console.log(this.user);
    this._userService.updateUser(this.user).subscribe(

      response=>{

        if(!response.user){

          this.status='error';

        }
        else{

          this.status='success';
          localStorage.setItem('identity',JSON.stringify(this.user));
          this.identity=this.user;
          setTimeout(()=>this._router.navigate(['/']),900);

          //subida de imagen de usuario

          this._uploadService.makeFileRequest(this.url+'upload-image-user/'+this.user._id,[],this.filesToUpload,this.token,'image')
                            .then((result:any)=>{

                                console.log(result);
                                this.user.image=result.user.image;
                                localStorage.setItem('identity',JSON.stringify(this.user));

                            })

        }

      },
      error=>{

           console.log(<any>error);
            this.status='error';
      }

      );
  }

  public filesToUpload:Array<File>;

  fileChangeEvent(fileInput:<any>){

    this.filesToUpload=<Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);

  }

}
