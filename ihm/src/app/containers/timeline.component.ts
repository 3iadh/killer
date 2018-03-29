import { Component, OnInit, HostListener, ElementRef } from '@angular/core'; 
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router'; //Routes
import { ContractService } from "../services/contracts.service"; //DAO
import { AccueilService } from "../services/accueil.service"; //DAO
import { MdDialog } from '@angular/material'; //Confirmation Dialog
import { Observable } from 'rxjs/Rx'; //Pour les intervals
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

@Component({
  templateUrl: '../templates/timeline.component.html',
  styleUrls: ['../styles/timeline.component.css']
})

export class TimelineComponent implements OnInit {
  
  isConnected: boolean;
  canShowMenu: boolean = true;
  
  private killers;
  private contracts;

  private startKillers;
  private endKillers;
  private startKills;
  private endKills;
  private startKillsSmallScreen;
  private endKillsSmallScreen;
  private showDiv;
  private showSecondDivKills;
  

  constructor(
    private contractService:ContractService,
    private accueilService:AccueilService) {
    this.killers = [];
    this.contracts = [];

    this.startKillers = 0;
    this.endKillers = 3;

    this.startKills = 0;
    this.endKills = 14;
    this.startKillsSmallScreen = null;
    this.endKillsSmallScreen = null;
    this.showDiv = [];

    this.showSecondDivKills = false;
  }

  public innerWidth: any;
  ngOnInit(): void {
    this.isConnected = true;
    this.innerWidth = window.innerWidth;

    if(this.innerWidth <= 1024){
      this.canShowMenu = false;
    }

    this.contractService.getKillers().then(res => {
      this.killers = res.data;
      for(var i = 0; i < this.killers.length; i++) {
        this.killers[i].killerphoto.data.url = this.accueilService.getMAinUrl() + this.killers[i].killerphoto.data.url;
        this.killers[i].nbKills = 0;
        this.killers[i].tools = [];
      }
      console.log(this.killers);
    });

    this.contractService.getConfirmedContracts().then(res => {
      this.contracts = res.data;
      for(var i = 0; i < this.contracts.length; i++) {
        var options = {weekday: "short", month: "short", day: "numeric"};
        var options2 = {hour:"numeric", minute:"numeric"};
        var date = new Date(this.contracts[i].handlingenddate);
        this.contracts[i].handlingenddate = date.toLocaleString("fr-FR", options) + " à " + date.toLocaleString("fr-FR", options2);

        //Dès qu'on trouve un contrat on ajourne le nombre de kills du killer
        var idKiller = this.contracts[i].killerid.data.id;
        var killer = this.killers.find(function(killers) {
          return killers.id == idKiller
        });
        killer.nbKills++;

        //On ajourne les outils utilisés du killer
        var tool = this.contracts[i].contractid.data.contracttoolid.data.toolid.data;
        tool.toolimage.data.url = this.accueilService.getMAinUrl() + tool.toolimage.data.url;

        //Si l'outil n'existe pas encore on l'ajoute et on l'initialise à 1, sinon on fait ++
        var found = false;
        for(var j = 0; j < killer.tools.length; j++) {
          if(killer.tools[j].id == tool.id) {
            killer.tools[j].count++;
            found = true;
            break;
          }
        }
        
        if(!found) {
          killer.tools[j] = tool;
          killer.tools[j].count = 1;
        }

        killer.tools.sort(function (a, b) {
          return b.count - a.count;
        });
      }
      console.log(this.contracts);
      console.log(this.killers[1].tools);

      //On trie dans l'ordre, celui qui a le plus de kills sera en premier
      this.killers.sort(function (a, b) {
        return b.nbKills - a.nbKills;
      });

      this.killers[0].rank = 1;
      this.killers[0].imgLaurel = "../assets/img/goldLaurel.png";
      this.killers[0].imgLaurelDetails = "../assets/img/goldLaurelDetails.png";
      this.showDiv[0] = false;
      for(i = 1; i < this.killers.length; i++) {
        if(this.killers[i].nbKills == this.killers[i-1].nbKills) {
          this.killers[i].rank = this.killers[i-1].rank;
        } else {
          this.killers[i].rank = this.killers[i-1].rank + 1;
        }
        if(this.killers[i].rank == 1) {
          this.killers[i].imgLaurel = "../assets/img/goldLaurel.png";
          this.killers[i].imgLaurelDetails = "../assets/img/goldLaurelDetails.png";
        }
        else if(this.killers[i].rank == 2) {
          this.killers[i].imgLaurel = "../assets/img/silverLaurel.png";
          this.killers[i].imgLaurelDetails = "../assets/img/silverLaurelDetails.png";
        }
        else if(this.killers[i].rank == 3) {
          this.killers[i].imgLaurel = "../assets/img/bronzeLaurel.png";
          this.killers[i].imgLaurelDetails = "../assets/img/bronzeLaurelDetails.png";
        }

        this.showDiv[i] = false;
      }

      if(this.innerWidth > 500 && this.innerWidth < 1224) {
        this.showSecondDivKills = true;
  
        if(this.contracts.length <= 30) {
          this.endKills = this.contracts.length / 2;
          this.startKillsSmallScreen = this.endKills + 1;
          this.endKillsSmallScreen = this.contracts.length;
        }
      }
    });

    setInterval(function() {
      document.location.reload();
    }, 300000); //Toutes les 5 minutes on recharge la page
  }

  @HostListener('window:resize', ['$event'])
      onResize(event) {
        this.innerWidth = window.innerWidth;
        if(this.innerWidth > 500 && this.innerWidth < 1224) {
          this.showSecondDivKills = true;
    
          if(this.contracts.length <= 30) {
            this.endKills = this.contracts.length / 2;
            this.startKillsSmallScreen = this.endKills + 1;
            this.endKillsSmallScreen = this.contracts.length;
          }
        } else {
          this.endKills = 14;
          this.startKillsSmallScreen = null;
          this.endKillsSmallScreen = null;
        }

        if(this.innerWidth <= 1024){
          this.canShowMenu = false;
        }else{
          this.canShowMenu = true;
        }
      }

  showAllKillers = function() {
    //Si il n'y a que 5 killers affichés
    if(this.endKillers == 3) {
      this.endKillers = this.killers.length;
      var div = document.querySelector("#showAllKillers").innerHTML = "Réduire";
    } else {
      this.endKillers = 3;
      var div = document.querySelector("#showAllKillers").innerHTML = "Tout voir";
    }
  }

  showAllKills = function() {
    //Si on est sur petit écran (et qu'on affiche deux listes, l'une à côté de l'autre)
    if(this.endKillsSmallScreen == 30) {
      this.endKills = this.contracts.length/2;
      this.endKillsSmallScreen = this.contracts.length;
      var div = document.querySelector("#showAllKills").innerHTML = "Réduire";
    } else if(this.endKillsSmallScreen != null) {
      this.endKillsSmallScreen = 30;
      var div = document.querySelector("#showAllKills").innerHTML = "Tout voir";
    }
    //Si il n'y a que 14 kills affichés
    else if(this.endKills == 14) {
      this.endKills = this.contracts.length;
      var div = document.querySelector("#showAllKills").innerHTML = "Réduire";
    } else {
      this.endKills = 14;
      var div = document.querySelector("#showAllKills").innerHTML = "Tout voir";
    }
  }

  showDetails = function(i) {
    //Si les détails étaient cachés, on cache tout, sinon c'est qu'il était affiché et donc que tous les autres sont déjà cachés
    if(!this.showDiv[i]) {
      this.hideAllDetailsDiv();
    }
    
    this.showDiv[i] = !this.showDiv[i];
  }

  hideAllDetailsDiv = function() {
    for(var i = 0; i < this.showDiv.length; i++) {
      this.showDiv[i] = false;
    }
  }
}