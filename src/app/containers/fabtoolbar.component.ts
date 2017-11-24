import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'killer-fab-toolbar',
  templateUrl: '../templates/components/fabtoolbar.html',
  styleUrls: ['../styles/fabtoolbar.css']
})
export class FabToolBarComponent {

  constructor(private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute) {

  }



}
