import { Component } from "@angular/core";
import { SocialSharing } from "@ionic-native/social-sharing";
import {
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import moment from "moment";

import { animation } from "../../../node_modules/@angular/core/src/animation/dsl";
import { TravelPlan } from "../../models/travelPlan";
import { TravelTrade } from "../../models/travelTrade";
import { TravelPlanProvider } from "../../providers/travel-plan/travel-plan";
import { TravelPlanTradesProvider } from "./../../providers/travel-plan-trades/travel-plan-trades";
import { TravelPlanPage } from "./../plan/travel-plan/travel-plan";
import { TravelPlansListPage } from "./../travel-plans-list/travel-plans-list";

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
    private modalCtrl: ModalController,
    private socialsharing: SocialSharing
  ) {
    this.orcamentoTotal = 0;
    this.createLoading();
    this.travelPlan = this.navParams.get("travelPlan");
    const subscribe = this.tptProvider
      .getAllByStartDate(this.travelPlan.key)
      .subscribe((tList: any) => {
        this.tradeList = tList;
        this.tradesPlan = new Array<{ date: Date; tt: Array<TravelTrade> }>();
        this.populaTrades();
        this.obtemTradesDias();
        this.getOrcamentoTotal();
        this.loading.dismiss();
        subscribe.unsubscribe();
      });
  }

  obtemTradesDias() {
    this.tradesPlanToday = new Array<{ date: Date; tt: Array<TravelTrade> }>();
    this.tradesPlanNextDays = new Array<{
      date: Date;
      tt: Array<TravelTrade>;
    }>();
    this.tradesPlanPrevDays = new Array<{
      date: Date;
      tt: Array<TravelTrade>;
    }>();

    this.today = new Date();

    this.tradesPlanToday = this.tradesPlan.filter(
      item => item.date.toDateString() == this.today.toDateString()
    );
    this.tradesPlanNextDays = this.tradesPlan.filter(
      item => item.date.toDateString() > this.today.toDateString()
    );
    this.tradesPlanPrevDays = this.tradesPlan.filter(
      item => item.date.toDateString() < this.today.toDateString()
    );
  }

  ionViewDidEnter() {
    this.today = new Date();
    this.lastDay = this.travelPlan.endDateTrip;
  }

  createLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Carregando detalhes do plano..."
    });
    this.loading.present();
  }

  private populaTrades() {
    this.tradeList.forEach((trade: TravelTrade) => {
      for (
        let d = moment(trade.startDateTrader);
        d.diff(trade.endDateTrader, "days") <= 0;
        d.add(1, "days")
      ) {
        if (
          !this.tradesPlan.find(
            item => item.date.toISOString() == d.toDate().toISOString()
          )
        ) {
          this.tradesPlan.push({
            date: d.toDate(),
            tt: [trade]
          });
        } else {
          var i = this.tradesPlan.findIndex(
            item => item.date.toISOString() == d.toDate().toISOString()
          );
          this.tradesPlan[i].tt.push(trade);
        }
      }
    });
  }

  getOrcamento(tt: TravelTrade[]) {
    var sum = 0;

    if (tt) {
      tt.map(item => {
        sum += item.avgPrice;
      });
      return sum;
    }
  }

  getOrcamentoTotal() {
    this.tradesPlan.map(i => {
      i.tt.map(j => {
        this.orcamentoTotal += j.avgPrice;
      });
    });
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

  openModal() {
    var modal = this.modalCtrl.create("ModalRatingPage", {
      animation: "slide-in-up",
      viewType: "bottom-sheet",
      enableBackdropDismiss: true
    });

    modal.present();
  }

  sharePlanWhatsapp() {
    this.socialsharing
      .shareViaWhatsApp(this.getShareMessage())
      .then(() => {
        console.log("Compartilhado no Whatsapp");
      })
      .catch(error => {
        this.toast
          .create({
            message: "Erro ao compartilhar plano no WhatsApp.",
            duration: 2000,
            position: "bottom"
          })
          .present();
        console.log("Erro ao compartilhar no WhatsApp" + error.code);
      });
  }

  getShareMessage() {
    let msg: string;
    msg =
      "Plano de Viagem\n\nPeríodo: " +
      this.travelPlan.startDateTrip.toDateString() +
      " - " +
      this.travelPlan.endDateTrip.toDateString() +
      "\n\nProgramação:\n\nHoje: " +
      this.getProgramacaoHoje() +
      this.getProgramacaoProxDias();

    return msg;
  }

  getProgramacaoHoje() {
    let msg: string;
    this.tradesPlanToday.map(tp =>
      tp.tt.map(travelTrade => {
        msg += "Cidade: " + travelTrade.city;
        msg += "\nCategoria:" + travelTrade.category;
        msg += "\nTrade: " + travelTrade.trade;
      })
    );

    return msg;
  }

  getProgramacaoProxDias() {
    let msg: string;
    this.tradesPlanNextDays.map(tp => {
      msg += "\n\nDia: " + tp.date.toDateString();
      tp.tt.map(travelTrade => {
        msg += "\nCidade: " + travelTrade.city;
        msg += "\nCategoria:" + travelTrade.category;
        msg += "\nTrade: " + travelTrade.trade;
      });
    });
    return msg;
  }
}
