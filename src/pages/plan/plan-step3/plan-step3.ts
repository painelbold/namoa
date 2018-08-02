import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TravelPlan } from '../../../models/travelPlan';
import { TravelPlanProvider } from '../../../providers/travel-plan/travel-plan';
import { ValidaCadastroProvider } from '../../../providers/valida-cadastro/valida-cadastro';
import { MyApp } from '../../../app/app.component';
import { TravelPlansListPage } from '../../travel-plans-list/travel-plans-list';
import { TravelTrade } from '../../../models/travelTrade';
import { TravelPlanTradesProvider } from '../../../providers/travel-plan-trades/travel-plan-trades';


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
  tradesList: Array<TravelTrade>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private tpProvider: TravelPlanProvider,
    private validaCadastro: ValidaCadastroProvider,
    private toastController: ToastController,
    private tptProvider: TravelPlanTradesProvider,
   public app: MyApp) {
    this.tp = JSON.parse(localStorage.getItem("travelplan"));
    this.tradesList = JSON.parse(localStorage.getItem("traveltrades"));
  }

  confirm(){
    this.tpProvider.save(this.tp, localStorage.getItem('loggedUserKey'))
    .then((result:any)=>{
      this.tptProvider.save(this.tradesList, result)
      .then(()=>{
        this.toastController.create({message: "Plano criado com sucesso", duration: 2000, position: "bottom"}).present();
        this.app.nav.setRoot(TravelPlansListPage);
      })
    })
    .catch(() => {
      this.toastController.create({message: "Erro na criação do plano.", duration: 2000, position: "bottom"}).present();
    });
  }

  returnStep2(){
    this.validaCadastro.setEnableStep2(true);
    this.validaCadastro.setEnableStep3(false);
    this.navCtrl.parent.select(1);
  }
}
