import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuController, NavController, NavParams, ToastController } from 'ionic-angular';

import { RegisterPage } from '../register/register';
import { ResetPasswordPage } from '../reset-password/reset-password';
import { TravelPlansListPage } from '../travel-plans-list/travel-plans-list';
import { AuthService } from './../../providers/auth/auth-service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  selectedItem: any;

  loginFields = { email: '', password: '', stayConnected: true };

  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private toastController: ToastController,
    private afAuth: AngularFireAuth,
    private menu: MenuController) {
  }

  login(form: NgForm) {
    if(form.valid){
      this.authService.signIn(this.loginFields)
      .then(()=> {
        if(this.loginFields.stayConnected){
          this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        }
        else{
          this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        }
        this.navCtrl.setRoot(TravelPlansListPage)
      })
      .catch((error)=>{
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
