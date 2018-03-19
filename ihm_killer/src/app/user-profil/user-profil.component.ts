import {  Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';
import { ContractService } from '../services/contracts.service';
import { MdDialog } from '@angular/material';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { AccueilService } from '../services/accueil.service';


@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css']
})
export class UserProfilComponent implements OnInit {
  isConnected: boolean;
  message: any;
  killer = {
    surnom: '',
    bench: '',
    email: '',
    sex: 1,
    password: '',
    password2: '',
    photo: null,
    team: ''
};


userId;
  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private loginservice: LoginService,
    private userservice: UserService,
    private contractservice: ContractService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private AccueilService: AccueilService,
    public dialog: MdDialog
  ) {
    translate.setDefaultLang('fr');
    this.toastyConfig.theme = 'material';
    this.route
      .queryParams
      .subscribe(params => {
        console.log('USER DATA');
        this.userId = params.userId;
        console.log(params);
      });
     }

  ngOnInit() {
    console.log('user connected id from parent: ' + this.userId);
    this.isConnected = true;
  }

}
