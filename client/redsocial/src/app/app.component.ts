import { Component,OnInit,DoCheck } from '@angular/core';
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

  		 private _userService:UserService;//injectamos el servicio para poder utilizarlo
  	){}


  	ngOnInit(){

  		this.identity=this._userService.getIdentity();
  		console.log(this.identity);
  	}

  	ngDoCheck(){
  		this.identity=this._userService.getIdentity();
  	}
}
