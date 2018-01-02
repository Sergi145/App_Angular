import {ModuleWithProviders} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';

//componentes
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import {StadisticsComponent} from './components/stadistics/stadistics/stadistics.component';

const appRoutes: Routes=[

	{path:'',component:HomeComponent},
	{path:'home',component:HomeComponent},
	{path:'login',component:LoginComponent},
	{path:'estadisticas',component:StadisticsComponent},
	{path:'registro',component:RegisterComponent},
	{path:'mis_datos',component:UserEditComponent},
	{path:'usuarios',component:UsersComponent},
	{path:'usuarios/:page',component:UsersComponent},
	{path:'**',component:HomeComponent}


];


export const appRoutingProviders:any[]=[];
export const routing:ModuleWithProviders=RouterModule.forRoot(appRoutes);