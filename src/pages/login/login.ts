import { AuthService } from './../../providers/auth/auth-service';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { ListPage } from '../list/list'
import { NgForm } from '@angular/forms';
import { ResetPasswordPage } from '../reset-password/reset-password';
import { RegisterPage } from '../register/register';
import { TravelPlansListPage } from '../travel-plans-list/travel-plans-list';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  selectedItem: any;
  
  loginFields = { email: '', password: '', stayConnected: '' };

  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private authService: AuthService,
    private toastController: ToastController,
    private menu: MenuController) {
  }

  login(form: NgForm) {
    if(form.valid){
      this.authService.signIn(this.loginFields)
      .then(()=> {
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
