import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import * as apiUrls from '../config/api';

declare var require: any;
const RemoteInstance = require('directus-sdk-javascript/remote.js');

const client = new RemoteInstance({
    url: apiUrls.connexion,  // chemin vers le serveur CMS déployé 
    accessToken: [apiUrls.acceToken] // optional, can be used without on public routes
});


@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }

// user information


    killerInfo = {
        lastname: 'totoe',
        firstname: '',
    };

    /* @parm : login, password
       @return : json containing user with login and password in @param if found
    */
    setUser(killer) {

        //découpage de l'email en nom et prenom
        let email = killer.email; // userEmail 

        let killerFirstInformation = email.split('@'); //split to take the first party of the mail 

        let userCivility = killerFirstInformation[0]; // to get the name and the first name
        let information = userCivility.split('.');

        this.killerInfo.firstname = information[0];
        this.killerInfo.lastname = information[1];
        return client.createItem('killers', {

            'killerfirstname': this.killerInfo.firstname,
            'killerlastname': this.killerInfo.lastname,
            'killersurname': killer.surnom,
            'killerbench': killer.bench,
            'killermail': killer.email,
            'killersex': killer.sex,
            'killerpassword': killer.password,
            'killerisavailable': 1,
            'teamid': killer.team,
            'killerphoto': killer.photo,
            'killerstatus': 1,  //Par défaut un nouveau utilsateur est diponible pour jouer
            'sort': 0
            
        })
    }

    createUserPicture(photo, name) {
        return client.createFile({
            'title': name,
            'name': name + '.png',
            'data': photo,
            'type': 'image/png'
        });
    }
}
