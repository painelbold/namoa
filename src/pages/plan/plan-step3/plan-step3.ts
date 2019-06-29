import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Loading, LoadingController } from 'ionic-angular';
import { TravelPlan } from '../../../models/travelPlan';
import { TravelPlanProvider } from '../../../providers/travel-plan/travel-plan';
import { ValidaCadastroProvider } from '../../../providers/valida-cadastro/valida-cadastro';
import { MyApp } from '../../../app/app.component';
import { TravelPlansListPage } from '../../travel-plans-list/travel-plans-list';
import { TravelTrade } from '../../../models/travelTrade';
import { TravelPlanTradesProvider } from '../../../providers/travel-plan-trades/travel-plan-trades';
import { resolveDefinition } from '../../../../node_modules/@angular/core/src/view/util';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import {TranslateService} from '@ngx-translate/core';

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
  addTradesList: Array<TravelTrade>;
  removeTradesList: Array<TravelTrade>;
  loading: Loading;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private tpProvider: TravelPlanProvider,
    private validaCadastro: ValidaCadastroProvider,
    private toastController: ToastController,
    private tptProvider: TravelPlanTradesProvider,
    private loadingCtrl: LoadingController,
    public http: Http,
    public app: MyApp,
    translate: TranslateService
   ) {

    translate.setDefaultLang(localStorage.getItem('idioma') || 'pt');
    translate.use(localStorage.getItem('idioma') || 'pt');
    
    this.tp = JSON.parse(localStorage.getItem("travelplan"));
    this.tradesList = JSON.parse(localStorage.getItem("traveltrades"));
    this.addTradesList = JSON.parse(localStorage.getItem("addTradesList"));
    this.removeTradesList = JSON.parse(localStorage.getItem("removeTradesList"));
  }

  createLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Salvando plano..."
    });
    this.loading.present();
  }

  visualizarCategoria(id){

      var categorias = JSON.parse(localStorage.getItem("categorias"))
      var filtroCat = categorias.filter(element => { return element.id === id });
      return filtroCat[0].descricao
      
  }

  confirm(){
    this.createLoading();
    this.tpProvider.save(this.tp, localStorage.getItem('loggedUserKey'))
    .then((result:any)=>{
      this.navParams.data = this.tp;

      if(this.removeTradesList.length > 0){
        this.tptProvider.deleteList(this.removeTradesList, result);
      }
      this.tptProvider.save(this.addTradesList, result)
      .then(()=>{

          const payload_plano = {
              "tituloTravelTrip" : this.tp.title,
              "startDateTrip" : this.tp.startDateTrip,
              "endDateTrip" : this.tp.endDateTrip,
              "usuario" : localStorage.getItem('loggedUserKey')
          };
          // console.log("payload_plano",payload_plano);
          let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
          let options = new RequestOptions({ headers: headers });

          this.http.post('http://namoa.vivainovacao.com/api/home/createPlano/',
                          payload_plano, options
          ).map(res => res.json()).subscribe(data => {

            // console.log("data retorno plano",data[0]);

            var retornoPlano = data[0];
            var payload_tradeList = {}

            this.tradesList.map(item =>{

              // console.log("item", item);

              payload_tradeList = {
                   "plano_id": retornoPlano.plano_id,
                   "tipoCategoria" : item.categoryType ,
                   "categoria" : item.category ,
                   "cidade" : item.city ,
                   "startDateTrader" : item.startDateTrader ,
                   "endDateTrader" : item.endDateTrader ,
                   "estado" : item.estado ,
                   "trade" : item.trade ,
                   "avgPrice" : item.avgPrice ,
                   "usuario" : localStorage.getItem('loggedUserKey'),
                   "outros": item.outros,
                   "valor_medio": item.valor_medio

              }

              // console.log("payload_tradeList",payload_tradeList)
              let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
              let options = new RequestOptions({ headers: headers });

              this.http.post('http://namoa.vivainovacao.com/api/home/createTrade/',
                          payload_tradeList, options
              ).map(res => res.json()).subscribe(data => {
                  this.toastController.create({message: "Plano criado com sucesso", duration: 2000, position: "bottom"}).present();
              })

            })

          });

      });

      this.app.nav.setRoot(TravelPlansListPage);
      this.loading.dismiss();
    })
    .catch((error) => {
      console.log(error);
      this.toastController.create({message: "Erro na criação do plano.", duration: 2000, position: "bottom"}).present();
    });
  }

  returnStep2(){
    this.validaCadastro.setEnableStep2(true);
    this.validaCadastro.setEnableStep3(false);
    this.navCtrl.parent.select(1);
  }
}
