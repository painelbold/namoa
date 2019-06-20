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

import { TravelPlan } from "../../models/travelPlan";
import { TravelTrade } from "../../models/travelTrade";
import { TravelPlanProvider } from "../../providers/travel-plan/travel-plan";
import { TravelPlanTradesProvider } from "./../../providers/travel-plan-trades/travel-plan-trades";
import { TravelPlanPage } from "./../plan/travel-plan/travel-plan";
import { TravelPlansListPage } from "./../travel-plans-list/travel-plans-list";

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import {TranslateService} from '@ngx-translate/core';


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

  catTradesPlanToday: Array<{ descricao: string = [] }>
  catTradesPlanNextDays: Array<{ descricao: string = [] }>
  catTradesPlanPrevDays: Array<{ descricao: string = [] }>

  orcamentoTotal: number;
  loading: Loading;
  formatter: Intl.NumberFormat;

  call: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private tptProvider: TravelPlanTradesProvider,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private tpProvider: TravelPlanProvider,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private socialsharing: SocialSharing,
    public http: Http,
    translate: TranslateService
  ) {

    translate.setDefaultLang(localStorage.getItem('idioma') || 'pt');
    translate.use(localStorage.getItem('idioma') || 'pt');
    
    this.orcamentoTotal = 0;
    this.createLoading();
    this.travelPlan = this.navParams.get("travelPlan");
    this.tradesPlanToday = new Array<{ date: Date; tt: Array<TravelTrade> }>();
    this.initArrays();
    this.formatter = new Intl.NumberFormat('pt-BR',{
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
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

      this.http.get('http://namoa.vivainovacao.com/api/home/tipoCategorias/').map(res => res.json()).subscribe(data => {
          localStorage.setItem("categorias", JSON.stringify(data[0]));

          this.visualizarCategoria();
      });
  }

  visualizarCategoria(){

    this.tradesPlanToday.map(item => {
      const itemTT = item.tt;
      itemTT.map(el =>{
          const categorias = JSON.parse(localStorage.getItem("categorias"));
          var filtroCat = categorias.filter(element => { return element.id === el.categoryType });

          el.categoria = filtroCat[0].descricao
      })  
    })

    this.tradesPlanNextDays.map(item => {
      const itemTT = item.tt;
      itemTT.map(el =>{
          const categorias = JSON.parse(localStorage.getItem("categorias"));
          var filtroCat = categorias.filter(element => { return element.id === el.categoryType });

          el.categoria = filtroCat[0].descricao
      })  
    })

    this.tradesPlanPrevDays.map(item => {
      const itemTT = item.tt;
      itemTT.map(el =>{
          const categorias = JSON.parse(localStorage.getItem("categorias"));
          var filtroCat = categorias.filter(element => { return element.id === el.categoryType });

          el.categoria = filtroCat[0].descricao
      })  
    })    
      
  }

  getCategoria(id){
      const categorias = JSON.parse(localStorage.getItem("categorias"));
      var filtroCat = categorias.filter(element => { return element.id === id });

      return filtroCat[0].descricao || "Não Informada";
  }

  obtemTradesDias(){
    // this.tradesPlanToday = new Array<{ date: Date; tt: Array<TravelTrade> }>();
    // this.tradesPlanNextDays = new Array<{ date: Date; tt: Array<TravelTrade> }>();
    // this.tradesPlanPrevDays = new Array<{ date: Date; tt: Array<TravelTrade> }>();

    this.today = new Date();
    this.today.setHours(0,0,0,0);

    this.tradesPlanToday = this.tradesPlan.filter(
      item => item.date.toISOString() == this.today.toISOString()
    );
    this.tradesPlanNextDays = this.tradesPlan.filter(
      item => item.date.toISOString() > this.today.toISOString()
    );
    this.tradesPlanPrevDays = this.tradesPlan.filter(
      item => item.date.toISOString() < this.today.toISOString()
    );
  }

  initArrays(){
    this.tradesPlanToday = new Array<{ date: Date; tt: Array<TravelTrade> }>();
    this.tradesPlanNextDays = new Array<{ date: Date; tt: Array<TravelTrade>; }>();
    this.tradesPlanPrevDays = new Array<{ date: Date;  tt: Array<TravelTrade>; }>();
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

            var payload_delete = {
              "title": this.travelPlan.title,
              "usuario": localStorage.getItem("loggedUserKey")
            }
            let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
            let options = new RequestOptions({ headers: headers });

            this.http.post('http://namoa.vivainovacao.com/api/home/removeTrade/',
                            payload_delete, options).map(res => res.json()).subscribe(data => {
              
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

            })

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

  openModal(rateDate: Date, trade:string) {
    var modal = this.modalCtrl.create("ModalRatingPage", {
      animation: "slide-in-up",
      viewType: "bottom-sheet",
      enableBackdropDismiss: true,
      userId: localStorage.getItem("loggedUserKey"),
      rateDate: rateDate.toISOString(),
      trade: trade
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
    let msg: string = '';

    msg =
      "*Plano de Viagem*\n\n_Período: " +
      moment(this.travelPlan.startDateTrip).format("D/MM/YYYY") +
      " - " +
      moment(this.travelPlan.endDateTrip).format("D/MM/YYYY") +
      "_\n\n*Programação:*\n\n_Hoje_:\n " +
      this.getProgramacaoHoje() +
      "\n\n_Próximos dias_: " + this.getProgramacaoProxDias();
    console.log(msg);
    return msg;
  }

  getProgramacaoHoje() : string {
    let msg: string = '';
    this.tradesPlanToday.map(tp =>
      tp.tt.map(travelTrade => {
        msg += "\nCidade: " + travelTrade.city;
        msg += "\nCategoria: " + this.getCategoria(travelTrade.categoryType);
        msg += "\nTrade: " + travelTrade.trade;
      })
    );
    return msg;
  }

  getProgramacaoProxDias() : string {
    let msg: string = '';
    this.tradesPlanNextDays.map(tp => {
      msg += "\n\nDia: " + moment(tp.date).format("D/MM/YYYY");

      tp.tt.map(travelTrade => {
        msg += "\nCidade: " + travelTrade.city;
        msg += "\nCategoria:" + this.getCategoria(travelTrade.categoryType);
        msg += "\nTrade: " + travelTrade.trade;
      });
    });
    console.log(msg);
    return msg;
  }
}
