import { UserDataProvider } from './../../providers/user-data/user-data';
import { Usuario } from './../../models/usuario';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '../../../node_modules/@angular/forms';
import { TravelPlansListPage } from '../travel-plans-list/travel-plans-list';

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
  user: Usuario;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private udProvider: UserDataProvider,
    private toastController: ToastController) {
      this.user = new Usuario();
      this.createForm();

      const subscribe = this.udProvider.getUserData()
      .subscribe((u: any) =>{
        this.user = u;
        this.createForm();
        subscribe.unsubscribe();
      });
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

  updateProfile(){
      this.udProvider.saveUserData(this.myProfileForm.value, this.user.key)
      .then(()=>{
        this.toastController.create({message: "Dados pessoais atualizados com sucesso.", duration: 2000, position: "bottom"}).present();
        this.navCtrl.setRoot(TravelPlansListPage);
      })
      .catch((error)=>{
        this.toastController.create({message: "Erro na atualização dos dados pessoais.", duration: 2000, position: "bottom"}).present();
        console.log("Erro na atualização dos dados pessoais:" + error);
      })
    }
}
