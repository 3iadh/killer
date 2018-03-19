import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { AppComponent } from './containers/app.component';
import { FormsModule } from '@angular/forms';

// For http request
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';


// For routing
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';



// For internationalization
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ConnexionService } from './services/connexion.service';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}


// For animation and material design
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './containers/login.component';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MaterialModule,
} from '@angular/material';

import 'hammerjs';
import { LoginService } from './services/login.service';
import { UserService } from './services/user.service';
import { AccueilComponent } from './containers/accueil.component';
import { AccueilService } from './services/accueil.service';
import { ContractService } from './services/contracts.service';
import { KillerDataService } from './services/killer-data.service';
import { DatePipe } from '@angular/common';
import { FooterComponent } from './containers/footer.component';
import { MenuComponent } from './containers/menu.component';
import { FabToolBarComponent } from './containers/fabtoolbar.component';
import { TimelineComponent } from "./containers/timeline.component";


import { ToastyModule } from 'ng2-toasty';
import { UserProfilComponent } from './user-profil/user-profil.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccueilComponent,
    FooterComponent,
    MenuComponent,
    TimelineComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    NoopAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    ToastyModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })

  ],
  exports: [
    TranslateModule,
  ],
  providers: [
    ConnexionService,
    LoginService,
    UserService,
    AccueilService,
    ContractService,
    KillerDataService,
    DatePipe
  ],
  entryComponents: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
