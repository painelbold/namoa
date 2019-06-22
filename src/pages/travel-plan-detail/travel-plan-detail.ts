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

  orcamentoTotal: number;
  orcamentoEfetivo: number = 0;
  loading: Loading;
  formatter: Intl.NumberFormat;

  listaTradeFui: any = [];

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
    private translate: TranslateService
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


      var payloadGP = {
        "plano_trade_id_app": this.travelPlan.key
      }
      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
      let options = new RequestOptions({ headers: headers });
      this.http.post('http://namoa.vivainovacao.com/api/home/getListaFui/',
                        payloadGP, options).map(res => res.json()).subscribe(data => {

              this.listaTradeFui = data;

              var atPLTR = this.tradesPlan[0].tt;
              atPLTR.map(item=>{

                var ret = this.listaTradeFui.filter(el=> el.plano_trade_id_app === item.key)

                if(ret.length>0){
                  item.fui = ret[0].status
                }
              })

              this.getOrcamentoEfetivo();
      })  

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

          el.catDescricao = filtroCat[0].descricao
      })  
    })

    this.tradesPlanNextDays.map(item => {
      const itemTT = item.tt;
      itemTT.map(el =>{
          const categorias = JSON.parse(localStorage.getItem("categorias"));
          var filtroCat = categorias.filter(element => { return element.id === el.categoryType });

          el.catDescricao = filtroCat[0].descricao
      })  
    })

    this.tradesPlanPrevDays.map(item => {
      const itemTT = item.tt;
      itemTT.map(el =>{
          const categorias = JSON.parse(localStorage.getItem("categorias"));
          var filtroCat = categorias.filter(element => { return element.id === el.categoryType });

          el.catDescricao = filtroCat[0].descricao
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
    var msg_load = "";
    this.translate.get("CARREGANDO DETALHES DO PLANO").subscribe(value => { msg_load = value });

    this.loading = this.loadingCtrl.create({
      content: msg_load
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

  informarFui(dados,status){
    
    var title_alert = "";
    var message_alert = "";

    if(status===1){
        this.translate.get("EU FUI").subscribe(value => { title_alert = value });
        this.translate.get("EU FUI?").subscribe(value => { message_alert = value });
    }else{
        this.translate.get("EU NÃO FUI").subscribe(value => { title_alert = value });
        this.translate.get("EU NÃO FUI?").subscribe(value => { message_alert = value });
    }

    
    let alert = this.alertCtrl.create({
      message: message_alert,
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

              var payload_fui = {
                "trade": dados.trade,
                "tipoCategoria": dados.categoryType,
                "categoria": dados.category,
                "cidade": dados.city,
                "startDateTrader": dados.startDateTrader,
                "endDateTrader": dados.endDateTrader,
                "usuario": localStorage.getItem("loggedUserKey"),
                "custo_previsto": dados.avgPrice,
                "custo_efetivo": dados.avgPrice,
                "status": status,
                "plano_trade_id_app": dados.key,
                "travel_plan_id_app": this.travelPlan.key
              }
              let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
              let options = new RequestOptions({ headers: headers });

              this.http.post('http://namoa.vivainovacao.com/api/home/informarfui/',
                              payload_fui, options).map(res => res.json()).subscribe(data => {
                                console.log("data FUI",data)

              })

          }
        }
      ]
    });
    alert.present();

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

  getOrcamentoEfetivo() {
    this.tradesPlan.map(i => {
      i.tt.map(j => {
        if(j.fui==="1"){
          this.orcamentoEfetivo += j.avgPrice;
        }
      });
    });
  }

  deletePlan() {

    var title_alert = "";
    var message_alert = "";
    var pl_rm_alert = "";
    var err_pl_alert = "";

    this.translate.get("CONFIRMAR EXCLUSÃO").subscribe(value => { title_alert = value });
    this.translate.get("TEM CERTEZA QUE DESEJA EXCLUIR O PLANO DE VIAGEM?").subscribe(value => { message_alert = value });

    this.translate.get("PLANO DE VIAGEM REMOVIDO.").subscribe(value => { pl_rm_alert = value });
    this.translate.get("ERRO NA REMOÇÃO DO PLANO DE VIAGEM.").subscribe(value => { err_pl_alert = value });

    let alert = this.alertCtrl.create({
      title: title_alert,
      message: message_alert,
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
                            message: pl_rm_alert,
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
                        message: err_pl_alert,
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

    var msg_load = "";
    this.translate.get("ERRO AO COMPARTILHAR PLANO NO WHATSAPP.").subscribe(value => { msg_load = value });
    
    this.socialsharing
      .shareViaWhatsApp(this.getShareMessage())
      .then(() => {
        console.log("Compartilhado no Whatsapp");
      })
      .catch(error => {
        this.toast
          .create({
            message: msg_load,
            duration: 2000,
            position: "bottom"
          })
          .present();
        console.log("Erro ao compartilhar no WhatsApp" + error.code);
      });
  }

  getShareMessage() {
    let msg: string = '';
    var title_msg = '';
    var periodo_msg = '';
    var prog_msg = '';
    var prox_msg = '';

    this.translate.get("PLANO DE VIAGEM").subscribe(value => { title_msg = value });
    this.translate.get("PERÍODO").subscribe(value => { periodo_msg = value });
    this.translate.get("PROGRAMAÇÃO").subscribe(value => { prog_msg = value });
    this.translate.get("PRÓXIMOS DIAS").subscribe(value => { prox_msg = value });

    msg = "*"+title_msg+"*\n\n_"+periodo_msg+": " +
      moment(this.travelPlan.startDateTrip).format("D/MM/YYYY") +
      " - " +
      moment(this.travelPlan.endDateTrip).format("D/MM/YYYY") +
      "_\n\n*"+prog_msg+":*\n\n_Hoje_:\n " +
      this.getProgramacaoHoje() +
      "\n\n_"+prox_msg+"_: " + this.getProgramacaoProxDias();
    console.log(msg);
    return msg;
  }

  getProgramacaoHoje() : string {

    var cidade_msg = '';
    var cat_msg = '';
    var trade_msg = '';

    this.translate.get("CIDADE").subscribe(value => { cidade_msg = value });
    this.translate.get("CATEGORIA").subscribe(value => { cat_msg = value });
    this.translate.get("TRADE").subscribe(value => { trade_msg = value });

    let msg: string = '';
    this.tradesPlanToday.map(tp =>
      tp.tt.map(travelTrade => {
        msg += "\n"+cidade_msg+": " + travelTrade.city;
        msg += "\n"+cat_msg+": " + this.getCategoria(travelTrade.categoryType);
        msg += "\n"+trade_msg+": " + travelTrade.trade;
      })
    );
    return msg;
  }

  getProgramacaoProxDias() : string {

    var cidade_msg = '';
    var cat_msg = '';
    var trade_msg = '';
    var dia_msg = '';

    this.translate.get("CIDADE").subscribe(value => { cidade_msg = value });
    this.translate.get("CATEGORIA").subscribe(value => { cat_msg = value });
    this.translate.get("TRADE").subscribe(value => { trade_msg = value });
    this.translate.get("DIA").subscribe(value => { dia_msg = value });

    let msg: string = '';
    this.tradesPlanNextDays.map(tp => {
      msg += "\n\n"+dia_msg+": " + moment(tp.date).format("D/MM/YYYY");

      tp.tt.map(travelTrade => {
        msg += "\n"+cidade_msg+": " + travelTrade.city;
        msg += "\n"+cat_msg+":" + this.getCategoria(travelTrade.categoryType);
        msg += "\n"+trade_msg+": " + travelTrade.trade;
      });
    });
    console.log(msg);
    return msg;
  }
}
