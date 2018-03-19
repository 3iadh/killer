import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: '../templates/app.component.html',
  styleUrls: ['../styles/app.component.css']
})
export class AppComponent {

  constructor(private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    translate.setDefaultLang('fr');
  }

  deconnect(){
    this.router.navigate(['/login']);
  }
}
