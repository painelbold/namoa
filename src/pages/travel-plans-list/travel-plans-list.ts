import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TravelPlanPage } from '../travel-plan/travel-plan';
import { TravelPlan } from './../../models/travelPlan';
import { TravelPlanProvider } from './../../providers/travel-plan/travel-plan';

/**
 * Generated class for the TravelPlansListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-travel-plans-list',
  templateUrl: 'travel-plans-list.html',
})
export class TravelPlansListPage {
  travelPlans: Array<TravelPlan>;
  cities: Array<string>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private tpProvider: TravelPlanProvider) {
      this.travelPlans = new Array<TravelPlan>();
      this.cities = new Array<string>();
  }

  ionViewDidLoad() {
    const subscribe = this.tpProvider.getAll(localStorage.getItem("loggedUserKey"))
    .subscribe((tp: any) =>{
        this.travelPlans = tp;
        subscribe.unsubscribe();
    });
  }

  newTravelPlan(){
    this.navCtrl.setRoot(TravelPlanPage);
  }

}
