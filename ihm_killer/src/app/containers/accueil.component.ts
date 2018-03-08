import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractService } from '../services/contracts.service';
import { AccueilService } from '../services/accueil.service';
import { MdDialog } from '@angular/material';

import { DialogKillDetails, DataService } from '../containers/dialogkilldetails.component';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';


@Component({
  selector: 'app-accueil-root',
  templateUrl: '../templates/accueil.component.html',
  styleUrls: ['../styles/accueil.component.css'],
})
export class AccueilComponent implements OnInit {
  isConnected: boolean;
   message: any;
  contract = [];
  contractDetail = null;
  cardClass = '';
  contratId;

  // Dans le cas ou j'ai tué quelqu'un et il faut que je déclare l'avoir tué
  killerValidationSet = false;
  canSetKillerValidation = false;

  // Dans le cas ou quelqu'un m'a tué et il faut que je confirme
  imKilled = false;
  canSetImKilled = false;
  missionStatus = false;

  infoDetail = {
    'targetInfo': {
      'bench': 'Espoir',
      'firstname': '',
      'killerlastname': '',
      'killerusername': '',
      'userImg': ''
    },
    'tool': '',
    'toolName': '',
    'action': '',
    'startDate': '',
    'id': null,
    'canSetKillerValidation': 0
  };
  deathDetail = {
    'killerInfo': {
      'bench': 'Espoir',
      'firstname': '',
      'lastname': '',
      'username': '',
      'userImg': '',
      'id': 0
    },
    'tool': '',
    'toolName': '',
    'action': '',
    'startDate': '',
    'id': null,
    'killed': false
  };

  // @Input('parentData') incomingData: string;
  //@Input() incomingData: string;
  afficheDetail: boolean;
  myUserId;
  userId;

  constructor(private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private contractservice: ContractService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private AccueilService: AccueilService,
    public dialog: MdDialog,
    private data: DataService
  ) {
    translate.setDefaultLang('fr');
    this.toastyConfig.theme = 'material';
    this.route
      .queryParams
      .subscribe(params => {
        this.userId = params['userId'];
      });
    if (this.userId !== undefined) {

      this.isConnected = true;
      this.getLostedContrat(this.userId);
    }

  }

  killDetails: string;
  ngOnInit() {
    this.afficheDetail = false;
    this.data.currentMessage.subscribe(killDetails => this.killDetails = killDetails);
    this.data.currentMessage.subscribe(message => this.message = message);
  }


  // permet de confirmer que nous avons tué le target
  setContratRempli() {
    let id = this.infoDetail.id;
    if (this.infoDetail.id != null) {
      this.contractservice.setTargetKilling(id).then(res => {
        this.killerValidationSet = true;
        // this.canSetKillerValidation = false;

        // Recharger la page après validation
        this.reloadData(this.userId);

      });
    }
  }

  GetProfil() {

  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogKillDetails, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.setImKilled();
    });
  }
  // Permet en tant que joueur de dire que j'ai été killé

  setImKilled() {
    let id = this.deathDetail.id;
    if (id != null) {
      this.contractservice.confirmImKilled(id, this.killDetails).then(res => {
        this.killerValidationSet = true;
        this.canSetKillerValidation = false;
        this.contractservice.setNewContractToKiller(this.infoDetail.id, this.deathDetail.killerInfo.id).then(res => {

        }).catch(res => {
          console.log(res);
        });
        this.addToast();
      }).catch(res => {
        console.log(res);
      });

    }
  }
  getImage() {
    this.contractservice.getImage(1).then(res => {
      console.log(res);
    });
  }
  // recharger les données

  reloadData(userId) {
    this.contractservice.getMyContract(userId).then(res => {
      this.isConnected = true;
       this.message = userId;
      if (res.data.length !== 0) {
        this.contract = res.data;
        this.contractDetail = this.contract[0].contractid.data;
        let toolUrl = this.AccueilService.getMAinUrl() + this.contractDetail.contracttoolid.data.toolid.data.toolimage.data.url;
        let toolName = this.contractDetail.contracttoolid.data.toolid.data.toolname;
        let targetImg = this.AccueilService.getMAinUrl() + this.contractDetail.contacttargetid.data.killerphoto.data.url;
        console.log(this.contractDetail);
        this.infoDetail = {
          'targetInfo': {
            'bench': this.contractDetail.contacttargetid.data.killerbench,
            'firstname': this.contractDetail.contacttargetid.data.killerfirstname,
            'killerlastname': this.contractDetail.contacttargetid.data.killerlastname,
            'killerusername': this.contractDetail.contacttargetid.data.killersurname,
            'userImg': targetImg,
          },
          'tool': toolUrl,
          'toolName': toolName,
          'action': this.contractDetail.contracttoolid.data.toolusage,
          'startDate': this.contractDetail.contractstartdate,
          'id': this.contract[0].id,
          'canSetKillerValidation': this.contract[0].killervalidation
        };


      if (this.cardClass === '') {
        this.cardClass = 'card';
      }
    } else {
      this.missionStatus = true;
    }
    }).catch(res => {
      console.log(res);
    });
  }


  // Récupérer le contrat que j'ai perdu

  getLostedContrat(id) {
    this.contractservice.getRequestConfirmation(id).then(res => {
      let contractId;
      if (res.data[0] != null) {
        contractId = res.data[0].id;
        console.log(res.data);
        if (contractId !== undefined) {
          this.contractservice.getUnConfirmedContract(contractId).then(res => {
            this.contract = res.data;
            if (this.contract[0] !== undefined) {
              this.contractDetail = this.contract[0].contractid.data;
              let toolUrl = this.AccueilService.getMAinUrl() + this.contractDetail.contracttoolid.data.toolid.data.toolimage.data.url;
              let toolName = this.contractDetail.contracttoolid.data.toolid.data.toolname;
              let targetImg = this.AccueilService.getMAinUrl() + this.contract[0].killerid.data.killerphoto.data.url;
              this.deathDetail = {
                'killerInfo': {
                  'bench': this.contract[0].killerid.data.killerbench,
                  'firstname': this.contract[0].killerid.data.killerfirstname,
                  'lastname': this.contract[0].killerid.data.killerlastname,
                  'username': this.contract[0].killerid.data.killersurname,
                  'id': this.contract[0].killerid.data.id,
                  'userImg': targetImg,
                },
                'tool': toolUrl,
                'toolName': toolName,
                'action': this.contractDetail.contracttoolid.data.toolusage,
                'startDate': this.contractDetail.contractstartdate,
                'id': this.contract[0].id,
                'killed': true
              };
              this.cardClass = 'cardLost';
            }
            this.reloadData(this.userId);
          });
        }
        else {
          return null;
        }
      } else {

        this.reloadData(this.userId);
      }
    });
  }
  getUsersKilled(userId) {
    this.contractservice.getUsersKilled(userId).then(res => {
      console.log(res);
    }).catch(res => {
      console.log(res)
    });

  }
  addToast() {
    var toastOptions: ToastOptions = {
      title: 'Nice',
      msg: 'Vous venez de killer XXX',
      showClose: true,
      timeout: 5000,
      theme: 'default'
    };

    // Add see all possible types in one shot
    this.toastyService.info(toastOptions);
    // this.toastyService.success(toastOptions);
    // this.toastyService.wait(toastOptions);
    // this.toastyService.error(toastOptions);
    // this.toastyService.warning(toastOptions);
  }
}
