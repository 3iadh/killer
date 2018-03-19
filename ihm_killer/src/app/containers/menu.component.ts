import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractService } from '../services/contracts.service';
import { AccueilService } from '../services/accueil.service';
import { MdDialog } from '@angular/material';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';



@Component({
  selector: 'killer-menu',
  templateUrl: '../templates/components/menu.html',
  styleUrls : ['../styles/menu.css']
})
export class MenuComponent {
    @Input() showMenu: boolean;
    isNotconnected: boolean;
    userId;
    user= {
      id: 1,
      nom: 'test'
    };
  token;
  constructor(private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
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
        this.userId = params['userId'];
      });
    }
  deconnect() {
    this.router.navigate(['/login']);
  }

  gotoTimeline() {
    this.router.navigate(['/timeline']);
  }
  gotoDashboard() {

  }

  gotoMyProfile() {
    this.router.navigate(['/profil'], { queryParams: { userId: this.userId} });
  }

  gotoDossiers() {
    this.router.navigate(['/dossiers']);
  }

}
