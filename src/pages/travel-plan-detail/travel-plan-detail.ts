import { Component } from "@angular/core";
import {
  AlertController,
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import moment from "moment";

import { TravelPlan } from "../../models/travelPlan";
import { TravelTrade } from "../../models/travelTrade";
import { TravelPlanProvider } from "../../providers/travel-plan/travel-plan";
import { TravelPlanTradesProvider } from "./../../providers/travel-plan-trades/travel-plan-trades";
import { TravelPlanPage } from "./../plan/travel-plan/travel-plan";
import { TravelPlansListPage } from "./../travel-plans-list/travel-plans-list";
import { Loading, LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: "page-travel-plan-detail",
  templateUrl: "travel-plan-detail.html"
})
export class TravelPlanDetailPage {
  travelPlan: TravelPlan;
  tradeList: Array<TravelTrade>;
  today: Date;
  lastDay: Date;
  travelLength: Array<Date>;
  tradesPlan: Array<{ date: Date; tt: Array<TravelTrade> }>;
  tradesPlanToday: Array<{ date: Date; tt: Array<TravelTrade> }>;
  tradesPlanNextDays: Array<{ date: Date; tt: Array<TravelTrade> }>;
  tradesPlanPrevDays: Array<{ date: Date; tt: Array<TravelTrade> }>;
  orcamentoTotal: number;
  loading: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private tptProvider: TravelPlanTradesProvider,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private tpProvider: TravelPlanProvider,
    private loadingCtrl: LoadingController,
  ) {
    this.orcamentoTotal = 0;
    this.createLoading();
    this.travelPlan = this.navParams.get("travelPlan");
    const subscribe = this.tptProvider
      .getAllByStartDate(this.travelPlan.key)
      .subscribe((tList: any) => {
        this.tradeList = tList;
        this.tradesPlan = new Array<{ date: Date; tt: Array<TravelTrade> }>();
        this.tradesPlanToday = new Array<{ date: Date; tt: Array<TravelTrade> }>();
        this.tradesPlanNextDays = new Array<{ date: Date; tt: Array<TravelTrade> }>();
        this.tradesPlanPrevDays = new Array<{ date: Date; tt: Array<TravelTrade> }>();
        this.populaTrades();
        this.loading.dismiss();
        subscribe.unsubscribe();
      });
  }

  ionViewDidEnter() {
    this.today = new Date();
    this.lastDay = this.travelPlan.endDateTrip;
  }

  createLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Carregando detalhes do plano..."
    });
    this.loading.present();
  }

  private populaTrades() {
    this.tradeList.forEach((trade: TravelTrade) => {
      for (let d = moment(trade.startDateTrader); d.diff(trade.endDateTrader, "days") <= 0; d.add(1, "days")) {
        if (!this.tradesPlan.find(item => item.date.toISOString() == d.toDate().toISOString())) {

          this.tradesPlan.push({
            date: d.toDate(),
            tt: [trade]
          });
        }
        else {
          var i = this.tradesPlan.findIndex(item => item.date.toISOString() == d.toDate().toISOString());
          this.tradesPlan[i].tt.push(trade);
        }
      }
    });
  }

  getOrcamento(tt: TravelTrade[]) {
    var sum = 0;

    if (tt) {
      tt.forEach(element => {
        sum += element.avgPrice;
      });

      return sum;
    }
  }

  deletePlan() {
    let alert = this.alertCtrl.create({
      title: "Confirmar exclusão",
      message: "Tem certeza que deseja excluir o plano de viagem?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Confirmar",
          handler: () => {
            this.tptProvider
              .delete(this.travelPlan.key)
              .then(() => {
                this.tpProvider
                  .delete(
                    localStorage.getItem("loggedUserKey"),
                    this.travelPlan.key
                  )
                  .then(() => {
                    this.toast
                      .create({
                        message: "Plano de viagem removido.",
                        duration: 2000,
                        position: "bottom"
                      })
                      .present();
                    this.navCtrl.setRoot(TravelPlansListPage);
                  });
              })
              .catch(() => {
                this.toast
                  .create({
                    message: "Erro na remoção de plano de viagem.",
                    duration: 2000,
                    position: "bottom"
                  })
                  .present();
              });
          }
        }
      ]
    });
    alert.present();
  }

  editPlan() {
    this.navCtrl.push(TravelPlanPage, {
      editTravelPlan: this.travelPlan
    });
  }
}
