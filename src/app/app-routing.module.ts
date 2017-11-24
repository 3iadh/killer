import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Include components route
import { AppComponent } from './containers/app.component';
import { LoginComponent } from "./containers/login.component";
import { AccueilComponent } from "./containers/accueil.component";



const routes: Routes = [
  // { path: 'home', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'accueil', component: AccueilComponent },  
  { path: '', redirectTo: '/login', pathMatch: 'full' }

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
