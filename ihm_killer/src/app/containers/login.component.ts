import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from "../services/login.service";
import { UserService } from "../services/user.service";
import { ContractService } from "../services/contracts.service";
@Component({
    selector: 'app-root',
    templateUrl: '../templates/login.component.html',
    styleUrls: ['../styles/login.component.css']
})
export class LoginComponent implements OnInit {

    parentData;
    isConnected: boolean;
    // showMenu : Boolean ;
    myUserId;
    timer;
    errorPassword = false; // If password are same or not
    errorMail = false;
    champsVide = false;
    killers = [];
    killers$: Promise<any>;
    teams = [];
    fil = null;
    killer = {
        surnom: '',
        bench: '',
        email: '',
        sex: 1,
        password: '',
        password2: '',
        photo: null,
        team: ''
    };

    inscription = false;
    error = false;

    //Values from user interface
    user = {
        useremail: 'ayawo-dela-fiogbo.ameganvi@capgemini.com',
        userpassword: 'espoir'
    }

    constructor(private translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        private loginservice: LoginService,
        private userservice: UserService,
        private contractservice: ContractService,
    ) {
        translate.setDefaultLang('fr');



    }

    ngOnInit(): void {
        this.getTeams();

    }
    selectFile() {
        document.getElementById('file').click();
        document.getElementById('file').addEventListener('change', this.readURL, true);
    }
    readURL() {
        let file = (<HTMLInputElement>document.getElementById('file')).files[0];
        var reader = new FileReader();
        let a = "";
        reader.onloadend = function () {
            document.getElementById('clock').style.backgroundImage = "url(" + reader.result + ")";
            console.log((<HTMLInputElement>document.getElementById('file')).files[0])
        }
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    seConnecter(user) {
        //return a promise containing data for user set in pramas
        this.killers$ = this.loginservice.getUser(this.user.useremail, this.user.userpassword);

        this.killers$.then(res => {

            this.killers = res.data;

            //if a result data is not null ==> a user found for the params ==> is connected
            if (this.killers.length != 0) {
                this.killers = res.data
                // console.log(this.killers);
                //After creating the account, redirect to the Accueil page
                this.parentData = this.killers[0].id + " -0";

                // this.ShowMenu = true ;
                // this.router.navigate(['/accueil', {userId : this.killers[0].id}]); //Passgin
                this.router.navigate(['/accueil'], { queryParams: { userId: this.killers[0].id } })
            } else {
                //No user found 
                this.error = true;
                console.log('No user fonud')
            }
        }).catch(err => {
            console.log(err);
        })
    }

    seInscrire() {

        this.errorMail = false;
        //check if capgemini mail *** Remplacer après par un Regex
        let email = this.killer.email; //userEmail 

        let killerFirstInformation = email.split("@"); //split to take the first party of the mail 

        let userCivility = killerFirstInformation[0]; //to get the name and the first name
        let information = userCivility.split('.');

        if ((information.length != 2) || killerFirstInformation[1] != 'capgemini.com') { //Dans un cas normal , nous devrions avoir un tableau avec 2 éléments , contenant le nom et le prénom
            this.errorMail = true
        } else {
            if (this.killer.bench != '' && this.killer.email != '' && this.killer.password != '' && this.killer.surnom != '') {
                console.log('toto')
                this.champsVide = false;
                this.inscription = false;
                console.log(this.killer);
                var url = document.getElementById('clock').style.backgroundImage;
                let photo = url.substr(5, url.length - 7);
                this.userservice.createUserPicture(photo, this.killer.surnom).then(res => {
                    this.killer.photo = res.data.id;
                    this.timer = setInterval(() => {
                        if (this.killer.photo != null) {
                            this.userservice.setUser(this.killer).then(res => {
                                console.log(res);
                                clearInterval(this.timer);
                            })
                                .catch(res => {
                                    console.log(res);
                                });
                        }
                    }, 1000);

                }).catch(res => {

                });
                this.initKiller();

                //Après incription, je vide l'utilisateur courant

                //After creating the account, redirect to the login page
                this.router.navigate(['/login']);

            } else {
                //Certains champs sont vide
                this.champsVide = true;
            }
        }
    }




    goToInscription() {
        this.inscription = true;
        this.error = false;
    }

    goToConnect() {
        this.inscription = false;
        this.error = false;
    }


    reinitChamp() {
        this.error = false;
    }

    passwordsAreDifferent() {
        this.errorPassword = false;

        if (this.killer.password != this.killer.password2)
            this.errorPassword = true;

    }

    initKiller() {
        this.killer = {
            surnom: '',
            bench: '',
            email: '',
            sex: 1,
            password: '',
            password2: '',
            photo: '',
            team: ''
        };
    }

    getTeams() {
        this.loginservice.getTeams().then(res => {
            this.teams = res.data;
        })
    }


}



