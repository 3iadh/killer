import { Component , Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { ConnexionService } from '../services/connexion.service' ;



@Component({
  selector: 'killer-footer',
  templateUrl: '../templates/components/footer.html',
  styleUrls: ['../styles/footer.css']
})
export class FooterComponent {

  constructor(private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute ){

      
    
    }

 

}
