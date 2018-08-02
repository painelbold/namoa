import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuController, NavController, NavParams, ToastController, Loading, LoadingController } from 'ionic-angular';

import { Usuario } from '../../models/usuario';
import { AuthService } from '../../providers/auth/auth-service';
import { TravelPlansListPage } from '../travel-plans-list/travel-plans-list';
import { UserDataProvider } from './../../providers/user-data/user-data';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  registerCredentials = { email: '', password: '', confirmPassword: ''};
  usuario: Usuario = new Usuario();
  loading: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
    private authService: AuthService,
    private userProvider: UserDataProvider,
    private menu: MenuController,
  private loadingCtrl: LoadingController) {
  }

  goBack(event) {
    this.navCtrl.pop();
  }

  ionViewDidEnter(){
    this.menu.enable(true, 'sideMenu');
  }

  ionViewWillEnter(){
    this.menu.enable(false, 'sideMenu');
  }

  createLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Registrando conta..."
    });
    this.loading.present();
  }


  onRegister(form: NgForm) {
    if (form.valid){
      if(this.registerCredentials.password == this.registerCredentials.confirmPassword){
        this.createLoading();
        this.authService.createUser(this.registerCredentials)
        .then((result: any)=> {
          this.usuario.email = this.registerCredentials.email;

          this.userProvider.saveUserData(this.usuario, '');

          this.loading.dismiss();

          this.toastController.create({message: "Usuário criado com sucesso", duration: 2000, position: "bottom"}).present();
          this.navCtrl.setRoot(TravelPlansListPage);
        })
        .catch((error:any)=>{
          this.loading.dismiss();
          switch (error.code){
            case "auth/email-already-in-use":
            this.toastController.create({message: "O e-mail inserido já está em uso.", duration: 2000, position: "bottom"}).present();
            break;
            case "auth/invalid-email":
            this.toastController.create({message: "O e-mail inserido é inválido.", duration: 2000, position: "bottom"}).present();
            break;
            case "auth/operation-not-allowed":
            this.toastController.create({message: "A operação não é permitida.", duration: 2000, position: "bottom"}).present();
            break;
            case "auth/weak-password":
            this.toastController.create({message: "A senha escolhida é fraca.", duration: 2000, position: "bottom"}).present();
            break;
            default:
            console.log("Erro ao registrar usuário: " + error.code);
            break;
          }
        })
      }
      else
      {
        this.toastController.create({message: "As senhas digitadas são diferentes.", duration: 2000, position: "bottom"}).present();
      }
    }
  }
}
