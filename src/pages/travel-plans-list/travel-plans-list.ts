import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, Content } from 'ionic-angular';

import { TravelPlanPage } from '../plan/travel-plan/travel-plan';
import { TravelPlan } from './../../models/travelPlan';
import { TravelPlanProvider } from './../../providers/travel-plan/travel-plan';
import { TravelPlanDetailPage } from '../travel-plan-detail/travel-plan-detail';

@IonicPage()
@Component({
  selector: 'page-travel-plans-list',
  templateUrl: 'travel-plans-list.html',
})
export class TravelPlansListPage {
  travelPlans: Array<TravelPlan>;
  cities: Array<string>;
  loading: Loading;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private tpProvider: TravelPlanProvider,
    private loadingCtrl: LoadingController) {
      this.travelPlans = new Array<TravelPlan>();
      this.cities = new Array<string>();
  }

  ionViewDidLoad() {
    this.createLoading();
    const subscribe = this.tpProvider.getAll(localStorage.getItem("loggedUserKey"))
    .subscribe((tp: any) =>{
        this.travelPlans = tp;
        this.loading.dismiss();
        subscribe.unsubscribe();
    });
  }

  createLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Carregando planos..."
    });
    this.loading.present();
  }

  newTravelPlan(){
    this.navCtrl.setRoot(TravelPlanPage);
  }

  openDetails(tp){
    this.navCtrl.push(TravelPlanDetailPage, {
      travelPlan: tp
    });
  }

}
