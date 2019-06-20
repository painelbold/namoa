import { UserDataProvider } from './../../providers/user-data/user-data';
import { Usuario } from './../../models/usuario';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Loading, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { TravelPlansListPage } from '../travel-plans-list/travel-plans-list';
import { AuthService } from '../../providers/auth/auth-service';

import {TranslateService} from '@ngx-translate/core';

/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
  maxDate: any;
  myProfileForm: FormGroup;
  passwordForm: FormGroup;
  user: Usuario;
  password: any;
  loading: Loading;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private udProvider: UserDataProvider,
    private toastController: ToastController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    translate: TranslateService) {

      translate.setDefaultLang(localStorage.getItem('idioma') || 'pt');
      translate.use(localStorage.getItem('idioma') || 'pt');

      this.user = new Usuario();
      this.createForm();
      this.createPasswordForm();

      const subscribe = this.udProvider.getUserData()
      .subscribe((u: any) =>{
        this.user = u;
        this.createForm();
        subscribe.unsubscribe();
      });
      this.password = { old: '', new: '', confirm: ''};
  }

  ionViewDidLoad() {
    this.maxDate = new Date().toISOString()
  }

  createForm(){
    this.myProfileForm = this.formBuilder.group({
      fullName: [this.user.fullName],
      phone: [this.user.phone],
      dateOfBirth: [this.user.dateOfBirth],
    });
  }

  createPasswordForm(){
    this.passwordForm = this.formBuilder.group({
      new: ['', Validators.required],
      old: ['', Validators.required],
      confirm: ['', Validators.required]
    })
  }

  createLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Salvando alterações..."
    });
    this.loading.present();
  }

  updateProfile(){
    this.createLoading();

      this.udProvider.saveUserData(this.myProfileForm.value, this.user.key)
      .then(()=>{
        this.loading.dismiss();
        this.toastController.create({message: "Dados pessoais atualizados com sucesso.", duration: 2000, position: "bottom"}).present();
        this.navCtrl.setRoot(TravelPlansListPage);
      })
      .catch((error)=>{
        this.loading.dismiss();
        this.toastController.create({message: "Erro na atualização dos dados pessoais.", duration: 2000, position: "bottom"}).present();
        console.log("Erro na atualização dos dados pessoais:" + error);
      })
    }

    changePassword(){

      if(this.validatePassword()){
        this.createLoading();
        this.authService.changePassword(this.password)
        .then(() => {
          this.loading.dismiss();
          this.createPasswordForm();
          this.toastController.create({message: "Senha alterada com sucesso.", duration: 2000, position: "bottom"}).present();
        })
        .catch((error: any) => {
          this.loading.dismiss();
          switch(error.code){
            case "auth/wrong-password":
          this.toastController.create({message: "A senha digitada está incorreta.", duration: 2000, position: "bottom"}).present();
            break;
            default:
            this.toastController.create({message: "Erro na alteração da senha.", duration: 2000, position: "bottom"}).present();
            break;
          }
        })
      }
    }

  validatePassword(){
    this.password = this.passwordForm.value;

    if(this.password.old == this.password.new){
      this.toastController.create({message: "Escolha uma senha diferente.", duration: 2000, position: "bottom"}).present();
      return false;
    }
    if(this.password.new != this.password.confirm){
      this.toastController.create({message: "As senhas digitadas não conferem.", duration: 2000, position: "bottom"}).present();
      return false;
    }
    return true;
  }
}
