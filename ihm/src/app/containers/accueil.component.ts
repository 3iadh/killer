import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef, HostListener  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractService } from "../services/contracts.service";
import { AccueilService } from "../services/accueil.service";
import { MdTooltip } from '@angular/material';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

@Component({
  selector: 'accueil-root',
  templateUrl: '../templates/accueil.component.html',
  styleUrls: ['../styles/accueil.component.css']
})
export class AccueilComponent implements OnInit {
  isConnected: boolean;
  contract = [];
  contractDetail = null;
  contratId;
  showButtons = false;
  loadDone = false;

  //Dans le cas ou j'ai tué quelqu'un et il faut que je déclare l'avoir tué
  killerValidationSet = false;
  canSetKillerValidation = false;

  //Dans le cas ou quelqu'un m'a tué et il faut que je confirme
  imKilled = false;
  canSetImKilled = false;

  infoDetail = {
    'targetInfo': {
      'bench': '',
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
    'canSetKillerValidation': 0,
    'userInfo': {
      'name': '',
      'username': '',
      'inscriptionDate': null,
      'email': '',
      'img': null
    }
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
  killedUsers = [];
  killedUsersJson = [];

  @Input('parentData') incomingData: string;

  myUserId
  userId;

  constructor(private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private contractservice: ContractService,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private AccueilService: AccueilService,
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
  canShowMenu = true;
  md = false;
  killDetails = {
    'description': '',
    'date': '',
    'time': ''
  }
  public innerWidth: any
  ngOnInit() {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth <= 1024){
      this.canShowMenu = false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth <= 1024){
      this.canShowMenu = false;
    }else{
      this.canShowMenu = true;
    }
  }

  //permet de confirmer que nous avons tué le target
  setContratRempli() {
    let id = this.infoDetail.id;
    if (this.infoDetail.id != null) {
      this.contractservice.setTargetKilling(id).then(res => {
        this.killerValidationSet = true;
        // this.canSetKillerValidation = false;

        //Recharger la page après validation
        this.reloadData(this.userId);

      })
    }
  }
 
  //Permet en tant que joueur de dire que j'ai été quillé

  setImKilled() {
    let id = this.deathDetail.id;
    if (id != null) {
      this.killDetails.time = this.killDetails.time + "-00"
      this.killDetails.time = this.killDetails.time.replace(":", "-");
      var binddingDate = "" + this.killDetails.date + "-" + this.killDetails.time;
      var dateArr = binddingDate.split("-");
      var date = new Date(parseInt(dateArr[0], 10),
        parseInt(dateArr[1], 10) - 1,
        parseInt(dateArr[2], 10),
        parseInt(dateArr[3], 10),
        parseInt(dateArr[4], 10),
        parseInt(dateArr[5], 10));
      console.log(binddingDate)
      console.log(date)
      this.contractservice.confirmImKilled(id, this.killDetails, date).then(res => {
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
  //recharger les données

  reloadData(userId) {
    this.contractservice.getMyContract(userId).then(res => {
      this.isConnected = true;
      this.contract = res.data;
      this.contractDetail = this.contract[0].contractid.data;
      let toolUrl = this.AccueilService.getMAinUrl() + this.contractDetail.contracttoolid.data.toolid.data.toolimage.data.url;
      let toolName = this.contractDetail.contracttoolid.data.toolid.data.toolname;
      let targetImg = this.AccueilService.getMAinUrl() + this.contractDetail.contacttargetid.data.killerphoto.data.url;
      let userImg = this.AccueilService.getMAinUrl() + this.contract[0].killerid.data.killerphoto.data.url;
      let inscriptionDate = new Date(this.contract[0].killerid.data.inscriptiondate);
      let options = { day: 'numeric', month: 'numeric', year: 'numeric' }
      this.infoDetail = {
        'targetInfo': {
          'bench': this.contractDetail.contacttargetid.data.killerbench,
          'firstname': this.contractDetail.contacttargetid.data.killerfirstname,
          'killerlastname': this.contractDetail.contacttargetid.data.killerlastname,
          'killerusername': '@' + this.contractDetail.contacttargetid.data.killersurname,
          'userImg': targetImg,
        },
        'tool': toolUrl,
        'toolName': toolName,
        'action': this.contractDetail.contracttoolid.data.toolusage,
        'startDate': this.contractDetail.contractstartdate,
        'id': this.contract[0].id,
        'canSetKillerValidation': this.contract[0].killervalidation,
        'userInfo': {
          'name': this.contract[0].killerid.data.killerfirstname + " " + this.contract[0].killerid.data.killerlastname,
          'username': '@' + this.contract[0].killerid.data.killersurname,
          'inscriptionDate': inscriptionDate.toLocaleString('fr-FR', options),
          'email': this.contract[0].killerid.data.killermail,
          'img': userImg
        }
      }
      this.getUsersKilled(userId);
    }).catch(res => {
      console.log(res);
    });
  }


  //Récupérer le contrat que j'ai perdu

  getLostedContrat(id) {
    this.contractservice.getRequestConfirmation(id).then(res => {
      let contractId;
      if (res.data[0] != null) {
        contractId = res.data[0].id;
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
              }
            }
            this.reloadData(this.userId);
          });
        }
        else {
          return null;
        }
      }
      else {

        this.reloadData(this.userId);
      }
    })
  }
  getUsersKilled(userId) {
    this.contractservice.getUsersKilled(userId).then(res => {
      this.killedUsersJson = res.data;
      this.fillKilledUsers(res.data);
      console.log(res);
    }).catch(res => {
      console.log(res)
    });

  }

  fillKilledUsers(killedUsersJson) {
    for (var i = 0; i < killedUsersJson.length; i++) {
      let endDate = new Date(killedUsersJson[i].handlingenddate);
      let options = { day: 'numeric', month: 'numeric', year: 'numeric' };
      let killedUser = {
        'contractDetails': {
          'endDate': endDate.toLocaleString('fr-FR', options),
          'tool': killedUsersJson[i].contractid.data.contracttoolid.data.toolid.data.toolname
        },
        'name': killedUsersJson[i].contractid.data.contacttargetid.data.killerfirstname + " " + killedUsersJson[i].contractid.data.contacttargetid.data.killerlastname,
        'username': '@' + killedUsersJson[i].contractid.data.contacttargetid.data.killersurname,
        'bench': killedUsersJson[i].contractid.data.contacttargetid.data.killerbench,
        'userImg': this.AccueilService.getMAinUrl() + killedUsersJson[i].contractid.data.contacttargetid.data.killerphoto.data.url
      }
      this.killedUsers.push(killedUser);
    }
    this.loadDone = true;

  }
  addToast() {
    var toastOptions: ToastOptions = {
      title: "Nice",
      msg: "Vous venez de killer XXX",
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
  confirmMouseHoverLeave() {
    this.showButtons = false;
  }
  confirmMouseHoverEnter() {
    this.showButtons = true;
  }

}
