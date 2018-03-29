import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class KillerDataService {

  private messageSource = new BehaviorSubject<string>('');

  CurrentMessage = this.messageSource.asObservable();

    constructor() { }

    changeMessage(message: any) {
        this.messageSource.next(message);
    }
}
