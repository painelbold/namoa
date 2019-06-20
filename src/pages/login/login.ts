import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuController, NavController, NavParams, ToastController, Loading, LoadingController } from 'ionic-angular';

import { RegisterPage } from '../register/register';
import { ResetPasswordPage } from '../reset-password/reset-password';
import { TravelPlansListPage } from '../travel-plans-list/travel-plans-list';
import { AuthService } from './../../providers/auth/auth-service';
import * as firebase from 'firebase/app';

import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  selectedItem: any;

  loginFields = { email: '', password: '', stayConnected: true };

  loading: Loading;

  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  language: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private toastController: ToastController,
    private afAuth: AngularFireAuth,
    private menu: MenuController,
    private loadingCtrl: LoadingController,
    translate: TranslateService) {

    translate.setDefaultLang(localStorage.getItem('idioma') || 'pt');
    translate.use(localStorage.getItem('idioma') || 'pt');


    if(localStorage.getItem('idioma')==='pt'){
        this.language = { idioma: "Português", srcImg: "./assets/imgs/languagePT.png" };
    }else if(localStorage.getItem('idioma')==='en'){
        this.language = { idioma: "Inglês", srcImg: "./assets/imgs/languageEN.png" };
    }else if(localStorage.getItem('idioma')==='es'){
        this.language = { idioma: "Espanhol", srcImg: "./assets/imgs/languageES.png" };
    }else if(localStorage.getItem('idioma')==='it'){
        this.language = { idioma: "Italiano", srcImg: "./assets/imgs/languageIT.png" };
    }else if(localStorage.getItem('idioma')==='fr'){
        this.language = { idioma: "Francês", srcImg: "./assets/imgs/languageFR.png" };
    }else if(localStorage.getItem('idioma')==='al'){
        this.language = { idioma: "Alemão", srcImg: "./assets/imgs/languageAL.png" };
    }else{
        this.language = { idioma: "Português", srcImg: "./assets/imgs/languagePT.png" };
    }
  }

  createLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Entrando na conta..."
    });
    this.loading.present();
  }

  alterIdioma(idioma){
    localStorage.setItem('idioma',idioma);
    window.location.reload()
  }


  login(form: NgForm) {
    if(form.valid){
      this.createLoading();
      this.authService.signIn(this.loginFields)
      .then(()=> {
        if(this.loginFields.stayConnected){
          this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        }
        else{
          this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        }
        this.loading.dismiss();
        this.navCtrl.setRoot(TravelPlansListPage)
      })
      .catch((error)=>{
        this.loading.dismiss();
        let toast = this.toastController.create({duration: 2000, position: "bottom"});

        switch(error.code){
          case "auth/invalid-email":
          toast.setMessage("O e-mail inserido não é válido.");
          break;
          case "auth/user-disabled":
          toast.setMessage("O usuário está desabilitado.");
          break;
          case "auth/user-not-found":
          toast.setMessage("Usuário não encontrado.");
          break;
          case "auth/wrong-password":
          toast.setMessage("E-mail ou senha incorretos.");
          break;
          default:
          toast.setMessage("Erro: " + error.code);
          break;
        }
        toast.present();
      });
    }
  }

  alterLanguage(event){
    localStorage.setItem("idioma",event)
  }

  ionViewDidEnter(){
    this.menu.enable(false, 'sideMenu');
  }

  ionViewDidLeave(){
    this.menu.enable(true, 'sideMenu');
  }

  createAccount(event) {
    this.navCtrl.push(RegisterPage);
  }

  resetPassword(event){
    this.navCtrl.push(ResetPasswordPage);
  }
}
