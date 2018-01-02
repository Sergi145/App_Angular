import { Component, OnInit } from '@angular/core';
import {GLOBAL} from '../../../services/global';
import {UserService} from '../../../services/user.service';


@Component({
  selector: 'app-stadistics',
  templateUrl: './stadistics.component.html',
  styleUrls: ['./stadistics.component.css']
})
export class StadisticsComponent implements OnInit {

	public identity;
	public token;
	public stats;
	public url;
	public status;

  constructor(

  		private _userService:UserService

  	) {

  			this.user=this._userService.getIdentity();
  			this.token=this._userService.getToken();
  			this.stats=this._userService.getStats();
  			this.url=GLOBAL.url;
  }

  ngOnInit() {
  }

}
