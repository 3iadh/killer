import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { DatePipe } from '@angular/common';

import * as apiUrls from '../config/api';

declare var require: any ;
const RemoteInstance = require('directus-sdk-javascript/remote.js');

const client = new RemoteInstance({
    url: apiUrls.connexion,  //chemin vers le serveur CMS déployé 
    accessToken: [apiUrls.acceToken], // optional, can be used without on public routes
});

@Injectable()
export class ContractService {

    constructor(private http: HttpClient, private datePipe: DatePipe) { }

    transformDate(date) {
        return this.datePipe.transform(date, 'yyyy-MM-dd H:m'); //whatever format you need. 
    }

    places = []; // Contient toutes les places du jeu
    places$
    actions = []; //Contient toutes les actions du jeu
    actions$;
    killers = []; //Contient tous les participants au jeu
    killers$
    killerContract = []; // Contient les killers avec leur contract
    contractsFromServer = []; //contient les contracts récupéré depuis le serveur


    contracts = []; //Contient les contrats qui seront créés
    contractsIndice = [];


    //Killer contract
    allKillerContract;

    //Get all Actions and All Place to create contract
    getPlaces(): Promise<any> {

        return client.getItems('places');

    }

    getActions(): Promise<any> {
        return client.getItems('actions');
    }

    getKillers(): Promise<any> {
        return client.getItems('killers', {
            'filters[killerisavailable][eq]': 1 //On ne récupère que les killers qui sont disponible à jouer
        });
    }

    getContracts(): Promise<any> {
        return client.getItems('Contracts');
    }

    //génération des contracts avec les places, actions et killers
    createContracts() {
        this.places$ = this.getPlaces().then(res => {
            this.places = res.data;
        }).catch(err => {

        });

        this.actions$ = this.getActions().then(res => {
            this.actions = res.data;
        }).catch(err => {

        });

        this.killers$ = this.getKillers().then(res => {
            this.killers = res.data;
        }).catch(err => {

        });

        console.log(this.places);
        console.log(this.actions);
        console.log(this.killers);

        //Parcours pour remplissage des contract
        console.log(this.transformDate(Date.now()));
        for (let i = 0; i < this.killers.length; i++) {
            for (let j = 0; j < this.actions.length; j++) {
                for (let k = 0; k < this.places.length; k++) {
                    let unContract = {
                        'contacttargetid': this.killers[i].id,
                        'contractactionid': this.actions[j].id,
                        'contractplaceid': this.places[k].id,
                        'contractstartdate': this.transformDate(Date.now()),
                        'status': 1
                    }
                    client.createItem('contracts', unContract);
                    this.contracts.push(unContract);
                }
            }
        }
    }

    //Permet de récupérer les contrats respectifs (en détail) et de pourvoir les asiigner.
    getServerContracts() {
        this.getContracts().then(res => {
            this.contractsFromServer = res.data;
            console.log(this.contractsFromServer)
        }).catch(err => {

        });
    }


    //Assignation de contrat au différents utilisateurs faisant parti du jeu
    createKillerContract() {
        let nbreKiller;

        //Killers
        this.killers$ = this.getKillers().then(res => {
            this.killers = res.data;
            nbreKiller = this.killers.length;

            // let allKillerContract = [];
            //Contract
            this.getContracts().then(res => {
                this.contractsFromServer = res.data;
                console.log(this.contractsFromServer)


                let usedContract = [];
                for (let i = 0; i < this.killers.length; i++) {

                    let indice;

                    do {
                        indice = this.getRandomInt(0, this.contractsFromServer.length);

                    } while (
                        //Il faut pas qu'il y ai la même mission pour 2 joueurs et il ne faut pas que la mission concerne le joueur lui même
                        (usedContract.includes(indice) == true) &&
                        (this.killers[i].id != this.contractsFromServer[indice].Contractid.contracttargetid.data.id)
                    )

                    usedContract.push(indice);
                    //Création du joueur temporaire (sert pas pour le moment hihihihih)
                    let killerContract = {
                        'killerid': this.killers[i].id,
                        'contractid': this.contractsFromServer[indice].id,
                        'status': 1
                    }

                    client.createItem('killercontracts', killerContract); //Assign contract to killers
                    // allKillerContract.push(killerContract);
                }

                // console.log(allKillerContract);
            }).catch(err => {

            });

        }).catch(err => {

        });
    }


    //Get all killer's contract, Fonction à déployer dans la page d'accueil
    getKillerContracts() {
        return client.getItems('killercontracts');
    }


    //get a specific user contraact
    getMyContract(id) {
        return client.getItems('killercontracts', {
            'filters[killerid][eq]': id, //On ne récupère que les killers qui sont disponible à jouer
            'filters[targetvalidation][eq]':0,
            'depth':4
        });
    }

    getContract(id) {
        return client.getItems('contracts', {
            'filters[id][eq]': id, //On ne récupère que les killers qui sont disponible à jouer
            'depth':4
        });
    }

    getImage(id){
        return client.getFile(id);
    }

    //get random value 
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //Le killeur a killer un target donc il va set la valeur killervalidation à true pour l'id du contrat
    setTargetKilling(id) {
        var date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        return client.updateItem('killercontracts', id, {
            'killervalidation': 1
        });
    }

    //Je confirme que j'ai été killé
    confirmImKilled(id,killDescription) {
        return client.updateItem('killercontracts', id, {
            'targetvalidation': 1,
            'handlingenddate': this.transformDate(Date.now()),
            'killdescription':killDescription
        });
    }

    //Récupérer les contrats que je dois confirmé
    getUnConfirmedContract(id) {
        return client.getItems('killercontracts', {
            'filters[contractid][eq]': id,
            'filters[killervalidation][eq]': 1, //On le récupère que si le killer a signalé nous avoir tué
            'filters[targetvalidation][eq]': 0,
            'depth':4
        });
    }

    getUsersKilled(id) {
        return client.getItems('killercontracts', {
            'filters[killerid][eq]': id,
            'filters[killervalidation][eq]': 1,
            'filters[targetvalidation][eq]': 1,
            'depth':4
        });
    }

    //Récupérer mon contrat perdu ==> Normalement je devrais en avoir qu'un par partie
    getRequestConfirmation(id) {
        return client.getItems('contracts', {
            'filters[contacttargetid][eq]': id,//Je récpère les contrats pour lesquels je suis une cible
        })
    }

    setNewContractToKiller(id,idNewKiller) {
        console.log(idNewKiller)
        return client.updateItem('killercontracts', id, {
            'killerid': idNewKiller

        })
    }

    getConfirmedContracts() {
        return client.getItems('killercontracts', {
            'filters[targetvalidation][eq]': 1,
            'order[handlingenddate]':'DESC',
            'depth':5
        });
    }
}
