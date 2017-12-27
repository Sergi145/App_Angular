import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {UploadService} from '../../services/upload.service';
import {GLOBAL} from '../../services/global';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers:[UserService]
})
export class UsersComponent implements OnInit {

	 public identity;//lleva el objeto del usuario identificado
  	public token;//lleva el token
  	public page;
  	public nextpage;
  	public prevpage;
  	public follows;
  	public status:string;
  	public total;
  	public pages;
  	public users:User[];

  constructor(

  		private _route:ActivatedRoute,
  		private _router:Router,
    	private _userService:UserService,//injectamos el servicio para poder utilizarlo

  	) {

  		this.user=this._userService.getIdentity();
  		this.token=this._userService.getToken();
  }

  ngOnInit() {

  	this.actualPage();
  }

  actualPage(){

  	this._route.params.subscribe(params=>{

  		let page=+params['page'];
  		this.page=page;

  		if(!page){
  			page=1;
  		}
  		else{

  			this.nextpage=page+1;
  			this.prevpage=page-1;

  			if(this.prevpage<=0)

  				this.prevpage=1;//asi no baja de la pagina 1

  		}

  		//devolver listado de usuarios

  			this.getUsers(page);
  	})
  }

  getUsers(page){

  		this._userService.getUsers(page).subscribe(
  				response=>{

  					if(!response.users)

  						this.status='error';
  					else

  						this.total=response.total;
  						this.users=response.users;
  						this.pages=response.pages;
  						this.follows=response.value;

  						console.log(this.follows);


  						if(page>this.pages)//si es mas grande que el numero de paginas le mandamos a la pagina 1

 							this._router.navigate(['/usuarios',1])

  				},

  				error=>{

  				  console.log(<any>error);

            		this.status='error';
  				}

  			)
  }

}
