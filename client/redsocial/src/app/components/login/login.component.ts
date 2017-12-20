import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UserService]//aqui introducimos los servicios que necesitamos

})
export class LoginComponent implements OnInit {

	public user:User;
  public status:string;
  public identity;//lleva el objeto del usuario identificado
  public token;//lleva el token

  constructor(

  	private _route:ActivatedRoute,
  	private _router:Router,
    private _userService:UserService//injectamos el servicio para poder utilizarlo

  	) {

  		this.user=new User("","","","","","","ROLE_USER","","")
  }

  ngOnInit() {
  }

   onSubmit(form){

    this._userService.singup(this.user).subscribe(

       response=>{

           this.identity=response.user;

           if(!this.identity || !this.identity._id){

             this.status='error';
           }
           else{

              console.log(response.user);

             this.status='success';
          
             //persistir datos del usuario

             localStorage.setItem('identity',JSON.stringify(this.identity));//como el local storage no deja guardara un objeto tenemos que pasarlo a json


             //conseguir el token

             this.getToken(form);

           }

       },
       error=>{

         this.status='error';
         form.reset();
         console.log(<any>error);
       }

      );
  }

  getToken(form){

     this._userService.singup(this.user,'true').subscribe(

       response=>{

           this.token=response.token;

           console.log(this.token);

           if(this.token.length<=0){

             this.status='error';
           }
           else{

               this.status='success';
                 form.reset();
             //persistir datos del usuario

               localStorage.setItem('token',this.token);

              
             //conseguir las estadisticas del usuario

             this.getCounters();
            
           }

       },
       error=>{

         this.status='error';
         console.log(<any>error);
       }

      );



  }


  getCounters(){

    this._userService.getCounters().subscribe(

      response=>{

        console.log(response);//aqui estan todas las estadisticas del usuario

        localStorage.setItem('stats',JSON.stringify(response));

 
        setTimeout(()=>this._router.navigate(['/']),900);

      
      },
      error=>{
        console.log(<any>error);
      }

      )
  }

}
