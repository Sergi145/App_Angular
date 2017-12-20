import { Component,OnInit,DoCheck } from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[UserService]//aqui introducimos los servicios que necesitamos
})
export class AppComponent implements OnInit,DoCheck{
  title = 'app';
  public identity;

  constructor(

       private _router:Router,
       private _route:ActivatedRoute,
  		 private _userService:UserService;//injectamos el servicio para poder utilizarlo
  	){}


  	ngOnInit(){

  		this.identity=this._userService.getIdentity();
  		console.log(this.identity);
  	}

  	ngDoCheck(){
  		this.identity=this._userService.getIdentity();
  	}

    logout(){

      localStorage.clear();
      this.identity=null;
      this._router.navigate(['/']);
    }
}
