import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import * as apiUrls from '../config/api';

declare var require: any ;
const RemoteInstance = require('directus-sdk-javascript/remote.js');

const client = new RemoteInstance({
    url: apiUrls.connexion,  // chemin vers le serveur CMS déployé 
    accessToken: [apiUrls.acceToken] // optional, can be used without on public routes
});

@Injectable()
export class ConnexionService {
    constructor(private http: HttpClient) { }
}
