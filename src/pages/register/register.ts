import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuController, NavController, NavParams, ToastController, Loading, LoadingController, ModalController } from 'ionic-angular';

import { Usuario } from '../../models/usuario';
import { AuthService } from '../../providers/auth/auth-service';
import { TravelPlansListPage } from '../travel-plans-list/travel-plans-list';
import { UserDataProvider } from './../../providers/user-data/user-data';

import { ModalQuestionarioPage } from '../modal-questionario/modal-questionario'

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  registerCredentials = { email: '', password: '', confirmPassword: ''};
  usuario: Usuario = new Usuario();
  loading: Loading;
  modalPreenchido: any = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
    private authService: AuthService,
    private userProvider: UserDataProvider,
    private menu: MenuController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public http: Http,
    translate: TranslateService) {

    translate.setDefaultLang(localStorage.getItem('idioma') || 'pt');
    translate.use(localStorage.getItem('idioma') || 'pt');
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
        
          let profileModal = this.modalCtrl.create(ModalQuestionarioPage);
          profileModal.present();

          if(localStorage.getItem('payload_questionario')){
            profileModal.dismiss({ retorno: true });
          }

          profileModal.onDidDismiss(data => {  

            if(data.retorno==true){
              //LIBERAR EFETIVAÇÃO DO CADASTRO

              this.createLoading();
              this.authService.createUser(this.registerCredentials)
              .then((result: any)=> {
                this.usuario.email = this.registerCredentials.email;

                this.userProvider.saveUserData(this.usuario, '');

                var payload_questionario = JSON.parse(localStorage.getItem('payload_questionario'));
                console.log("payload_questionario.usuario",payload_questionario.usuario)

                payload_questionario.usuario = this.registerCredentials.email;
                console.log("payload_questionario =>",payload_questionario)

                let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
                let options = new RequestOptions({ headers: headers });

                this.http.post('http://namoa.vivainovacao.com/api/home/insertquestionario/',
                                payload_questionario, options).map(res => res.json()).subscribe(data => {
                  this.loading.dismiss();

                  this.toastController.create({message: "Usuário criado com sucesso", duration: 3000, position: "bottom"}).present();
                  this.navCtrl.setRoot(TravelPlansListPage);

                })

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
                    this.createLoading();
                    
                    var payload_questionario = JSON.parse(localStorage.getItem('payload_questionario'));
                    console.log("payload_questionario.usuario",payload_questionario.usuario)

                    payload_questionario.usuario = this.registerCredentials.email;
                    console.log("payload_questionario =>",payload_questionario)

                    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
                    let options = new RequestOptions({ headers: headers });

                    this.http.post('http://namoa.vivainovacao.com/api/home/insertquestionario/',
                                    payload_questionario, options).map(res => res.json()).subscribe(data => {
                      this.loading.dismiss();

                      this.toastController.create({message: "Usuário criado com sucesso", duration: 3000, position: "bottom"}).present();
                      this.navCtrl.setRoot(TravelPlansListPage);

                    })
                  break;
                }
              })

              //FIM DO LIBERAR EFETIVAÇÃO DO CADASTRO

            }
          });

      }
      else
      {
        this.toastController.create({message: "As senhas digitadas são diferentes.", duration: 2000, position: "bottom"}).present();
      }
    }


  }


}
