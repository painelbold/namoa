import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';

import { TravelPlan } from '../../models/travelPlan';
import { TravelTrade } from '../../models/travelTrade';
import { TravelPlanTradesProvider } from '../../providers/travel-plan-trades/travel-plan-trades';

@IonicPage()
@Component({
  selector: 'page-travel-plan-detail',
  templateUrl: 'travel-plan-detail.html',
})
export class TravelPlanDetailPage {
  travelPlan: TravelPlan;
  tradeList: Array<TravelTrade>;
  today: Date;
  lastDay: Date;
  travelLength: Array<Date>;
  tradesPlan: Array<{ date: Date, tt: Array<TravelTrade> }>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private tptProvider: TravelPlanTradesProvider) {
    this.travelPlan = this.navParams.get("travelPlan");
    const subscribe = this.tptProvider.getAllByStartDate(this.travelPlan.key)
    .subscribe((tList: any) =>{
      this.tradeList = tList;
      subscribe.unsubscribe;
    })
  }

  ionViewDidEnter(){
    this.today = new Date();
    this.lastDay = this.travelPlan.endDateTrip;
    this.tradesPlan = new Array<{date: Date, tt: Array<TravelTrade>}>();

    this.tradeList.forEach((trade: TravelTrade) =>{
      for(let d = moment(trade.startDateTrader);
      d.diff(trade.endDateTrader, 'days') <= 0;
      d.add(1, 'days')){
        if(!this.tradesPlan.find(item => item.date.toISOString() == d.toDate().toISOString()))
        {
          this.tradesPlan.push({
            date: d.toDate(),
            tt: [trade]
          });
        }
        else{
          var i = this.tradesPlan.findIndex(item => item.date.toISOString() == d.toDate().toISOString())
          this.tradesPlan[i].tt.push(trade);
        }
      }
    });

  }

}
