import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TravelPlan } from '../../../models/travelPlan';
import { TravelPlanProvider } from '../../../providers/travel-plan/travel-plan';
import { ValidaCadastroProvider } from '../../../providers/valida-cadastro/valida-cadastro';
import { MyApp } from '../../../app/app.component';
import { TravelPlansListPage } from '../../travel-plans-list/travel-plans-list';


/**
 * Generated class for the PlanStep3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-plan-step3',
  templateUrl: 'plan-step3.html',
})
export class PlanStep3Page {
  tp: TravelPlan;
  items: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private tpProvider: TravelPlanProvider,
    private validaCadastro: ValidaCadastroProvider,
    private toastController: ToastController,
   public app: MyApp) {
    this.tp = JSON.parse(localStorage.getItem("travelplan"));
    this.items = this.tp.trades;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlanStep3Page');
  }

  confirm(){
    this.tpProvider.save(this.tp, localStorage.getItem('loggedUserKey'))
    .then((result:any)=>{
      this.toastController.create({message: "Plano criado com sucesso", duration: 2000, position: "bottom"}).present();
      this.app.nav.setRoot(TravelPlansListPage);
    })
  }

  returnStep2(){
    this.validaCadastro.setEnableStep2(true);
    this.validaCadastro.setEnableStep3(false);
    localStorage.setItem("travelplan", JSON.stringify(this.tp));
    this.navCtrl.parent.select(1);
  }
}
