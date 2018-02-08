import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'killer-menu',
  templateUrl: '../templates/components/menu.html',
  styleUrls : ['../styles/menu.css']
})
export class MenuComponent {
    @Input() showMenu: boolean;
    isNotconnected : boolean;
  user;
  token;
  constructor(private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  deconnect(){
    this.router.navigate(['/login']);
  }

  gotoTimeline(){
   
  }
  gotoDashboard() {

  }

  gotoDossiers() {
    this.router.navigate(['/dossiers']);
  }

  
}
