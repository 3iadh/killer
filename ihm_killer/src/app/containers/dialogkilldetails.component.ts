import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Component, Input, Inject, Output, EventEmitter, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class DataService {
    private messageSource = new BehaviorSubject<string>("default message");
    currentMessage = this.messageSource.asObservable();
    constructor() { }
    changeMessage(message: string) {
        this.messageSource.next(message)
    }
}

@Component({
    selector: 'dialog-overview-dialog',
    templateUrl: '../templates/dialog/dialog.html',
})
export class DialogKillDetails implements OnInit {
    @Output() messageEvent = new EventEmitter<string>();
    constructor(
        public dialogRef: MdDialogRef<DialogKillDetails>,
        @Inject(MD_DIALOG_DATA) killDetails: any, public data: DataService) { }

    onNoClick(): void {
        this.dialogRef.close();
        console.log()
    }
    message: string;
    ngOnInit() {
        this.data.currentMessage.subscribe(killDetails => this.message = killDetails)
    }
    newMessage(killDetails) {
        this.data.changeMessage(killDetails)
    }
}

