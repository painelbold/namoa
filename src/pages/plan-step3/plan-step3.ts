import { MyApp } from './../../app/app.component';
import { TravelPlanProvider } from './../../providers/travel-plan/travel-plan';
import { TravelPlan } from './../../models/travelPlan';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TravelPlansListPage } from '../travel-plans-list/travel-plans-list';
import { TravelPlanPage } from '../travel-plan/travel-plan';
import { app } from '../../../node_modules/firebase';

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
}
