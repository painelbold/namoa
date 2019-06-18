import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  AlertController,
  Loading,
  LoadingController
} from "ionic-angular";
import { TravelPlan } from "../../../models/travelPlan";
import { TravelTrade } from "../../../models/travelTrade";
import {
  FormGroup,
  FormBuilder,
  Validators
} from "../../../../node_modules/@angular/forms";
import { ValidaCadastroProvider } from "../../../providers/valida-cadastro/valida-cadastro";
import { TravelPlanTradesProvider } from '../../../providers/travel-plan-trades/travel-plan-trades';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the PlanStep2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-plan-step2",
  templateUrl: "plan-step2.html"
})
export class PlanStep2Page {
  tp: TravelPlan;
  travelTrade: TravelTrade;
  tradesList: Array<TravelTrade>;
  addTradesList: Array<TravelTrade>;
  removeTradesList: Array<TravelTrade>;
  step2Form: FormGroup;
  formTitle: string;
  loading: Loading;

  minDate: any;
  minEndDate: any;

  tradePrice: Array<number>;
  optionSugestaoTrade: Array<{ trade: string, valor: string }>;
  resultTrade: Array<{ id: string, descricao: string }>;
  cidades: Array<{ id: number; descricao: string }>;
  tpCategoria: Array<{ id: number; descricao: string }>;
  categoria: Array<{ id: number; descricao: string }>;
  trade: Array<{ id: number; descricao: string; min_value: string; max_value: string; }>;
  estados: Array<{ nome_estado: string, sigla_estado: string} >;
  optionSugestao: Array<{ cidade: string, valor: string }>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private validaCadastro: ValidaCadastroProvider,
    private toast: ToastController,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private tptProvider: TravelPlanTradesProvider,
    private loadingCtrl: LoadingController,
    public http: Http
  ) {
    this.tp = JSON.parse(localStorage.getItem("travelplan"));
    this.tradesList = new Array<TravelTrade>();
    this.travelTrade = new TravelTrade();
    this.setupPageTitle();

    this.loadTrades();
    this.createForm();
    this.populateDropdowns();
  }

  createLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Carregando..."
    });
    this.loading.present();
  }


  private loadTrades(){
    if(this.tp.key){
      // this.createLoading();
      const subscribe = this.tptProvider.getAllByStartDate(this.tp.key)
      .subscribe((tList: any)=>{
        this.tradesList = tList;
        // this.loading.dismiss();
        subscribe.unsubscribe();
      });
    }
  }

  private populateDropdowns() {
    
    
    this.estados = [];
    this.cidades = [];
    this.tpCategoria = [];
    this.categoria = [];
    this.optionSugestao = [];
    this.optionSugestaoTrade = [];

    this.trade = [];
    this.tradePrice = [100, 50, 20, 60, 200, 300, 40, 15];
  }

  private setupPageTitle(){
    this.formTitle = this.tp.key ? 'Editar plano' : 'Novo Plano';
  }

  ionViewDidLoad() {

    this.getEstado();
    this.getTipoCategoria();
    this.getSugestoes();
    // this.getTrade();
    this.minDate = this.tp.startDateTrip;
    this.step2Form.patchValue({
      startDateTrader: this.minDate
    });
    this.minEndDate = this.minDate;
    this.tradesList = new Array<TravelTrade>();
    this.addTradesList = new Array<TravelTrade>();
    this.removeTradesList = new Array<TravelTrade>();
  }

  getSugestoes(){
      var payload_questionario = JSON.parse(localStorage.getItem('payload_questionario'));

      let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
      let options = new RequestOptions({ headers: headers });

      this.http.post('https://cors-anywhere.herokuapp.com/http://beenils.com.br:8080',
      payload_questionario, options).map(res => res.json()).subscribe(data => {
        
          //CONVERTENDO LISTA EM ARRAY COM DADOS
          var new_city_choices = data.city_choices;
          var newSugestoes = [];
          var chavesCidades = Object.keys(new_city_choices);
          // var valueCidades = Object.values(new_city_choices); 

          for(var loop = 0; loop < chavesCidades.length; loop++){
              
              var elemento = {
                cidade: chavesCidades[loop],
                valor: data.city_choices[chavesCidades[loop]]
              }
              newSugestoes.push(elemento);
          }

          //PEGANDO VALOR MAIOR DA SUGESTAO
          var elementMax = 0;

          newSugestoes.map(item => {
            if(item.valor>elementMax){
              elementMax = item.valor;
              this.optionSugestao.push(item);
            }
          })

          //VERIFICÇÃO DE SUGESTÃO DE TRADE

          var new_trade_choices = data.trade_choices;
          var newSugestoesTrade = [];
          var chavesTrade = Object.keys(new_trade_choices);
          // var valueTrade = Object.values(new_trade_choices); 

          for(var loop = 0; loop < chavesTrade.length; loop++){
              var elementoTrade = {
                trade: chavesTrade[loop],
                valor: data.trade_choices[chavesTrade[loop]]
              }
              newSugestoesTrade.push(elementoTrade);
          }

          // console.log("newSugestoesTrade",newSugestoesTrade)

          //PEGANDO VALOR MAIOR DA SUGESTAO
          var elementMaxTrade = 0;
          
          newSugestoesTrade.map(itemT => {
            if(itemT.valor>elementMaxTrade){
              elementMaxTrade = itemT.valor;
              this.optionSugestaoTrade = [itemT];
              this.getTradeSugestao(itemT.trade);
            }
          })

      })
  }

  getTradeSugestao(id){

      this.http.get('http://namoa.vivainovacao.com/api/home/getTrade/'+id).map(res => res.json()).subscribe(data => {
          // console.log("data",data[0]);
          this.resultTrade = data[0];
      },err =>{
          this.getTradeSugestao(id);
      });

  }

  getEstado(){
      this.createLoading();

      this.http.get('http://namoa.vivainovacao.com/api/home/estado/').map(res => res.json()).subscribe(data => {
          // console.log("data",data[0]);
          this.estados = data[0];
          this.loading.dismiss();
      },err =>{
          this.loading.dismiss();
          this.getEstado();
      });

  }

  getCidades(estado){

    if(estado!=""){

    this.createLoading();
      this.http.get('http://namoa.vivainovacao.com/api/home/filtercidades/'+estado).map(res => res.json()).subscribe(data => {
          this.cidades = data[0];
          this.loading.dismiss();
      },err =>{
          this.loading.dismiss();
          this.getCidades(estado);
      })
    }

  }

  getTipoCategoria(){

      this.http.get('http://namoa.vivainovacao.com/api/home/tipoCategorias/').map(res => res.json()).subscribe(data => {
          this.tpCategoria = data[0];
          localStorage.setItem("categorias", JSON.stringify(data[0]));
      },err =>{
          this.getTipoCategoria();
      });

  }

  getCategoria(tipo){

    this.createLoading();

    // console.log("Estado Selecionado",tipo);

    this.http.get('http://namoa.vivainovacao.com/api/home/categorias/'+tipo).map(res => res.json()).subscribe(data => {
        // console.log("data",data[0]);
        this.categoria = data[0];
        this.loading.dismiss();
    }, err =>{
        this.loading.dismiss();
        this.getCategoria(tipo);
    })

  }

  getTrade(subcategoria){

    if(this.step2Form.value.city!=""){

      this.createLoading();
      
      this.http.get('http://namoa.vivainovacao.com/api/home/trade/'+encodeURI(this.step2Form.value.city)+'/'+subcategoria).map(res => res.json()).subscribe(data => {
            // console.log("data TRADE",data[0]);
            this.trade = data[0];
            this.loading.dismiss();
            // console.log("this.trade",this.trade)
        },err =>{
            this.loading.dismiss();
            this.getTrade(subcategoria);
        });
    }

  }

  submitStep2() {
    this.validaCadastro.setEnableStep2(false);
    this.validaCadastro.setEnableStep3(true);
    localStorage.setItem("travelplan", JSON.stringify(this.tp));
    localStorage.setItem("traveltrades", JSON.stringify(this.tradesList));
    localStorage.setItem("addTradesList", JSON.stringify(this.addTradesList));
    localStorage.setItem("removeTradesList", JSON.stringify(this.removeTradesList));
    this.navCtrl.parent.select(2);
  }

  dtInicioChange() {
    this.minEndDate = this.step2Form.controls["startDateTrader"].value;
    if(this.minEndDate > this.step2Form.controls["endDateTrader"].value){
      this.step2Form.patchValue({
        endDateTrader: ''
      });
    }
  }

  // SelectTrade(idTrade){
  //   if(idTrade){
  //       var tradePrice = this.trade.filter(el => el.descricao === idTrade)
  //       this.travelTrade.avgPrice = (parseInt(tradePrice[0].min_value) || 0 + parseInt(tradePrice[0].max_value) || 0)/2;
  //   }
    
  // }

  addTrade() {
    this.travelTrade = this.step2Form.value;

    
    // this.travelTrade.avgPrice = this.tradePrice[
    //   Math.floor(Math.random() * this.tradePrice.length)
    // ];
    // console.log("this.trade",this.trade)
    var tradePrice = this.trade.filter(el => el.descricao === this.travelTrade.trade)
    this.travelTrade.avgPrice = (parseInt(tradePrice[0].min_value)+ parseInt(tradePrice[0].max_value))/2;

    // console.log("this.travelTrade.avgPrice",this.travelTrade.avgPrice)
    this.addTradesList.push(this.travelTrade);
    this.tradesList.push(this.travelTrade);
    this.travelTrade = new TravelTrade();
    this.createForm();
    this.toast
      .create({
        message: "Trade adicionado com sucesso",
        duration: 2000,
        position: "bottom"
      })
      .present();
  }

  visualizarCategoria(id){

      var categorias = JSON.parse(localStorage.getItem("categorias"))
      var filtroCat = categorias.filter(element => { return element.id === id });
      return filtroCat[0].descricao
      
  }

  createForm() {
    
    this.step2Form = this.formBuilder.group({
      estado: ["", Validators.required],
      city: ["", Validators.required],
      categoryType: ["", Validators.required],
      category: ["", Validators.required],
      trade: ["", Validators.required],
      startDateTrader: ["", Validators.required],
      endDateTrader: ["", Validators.required]
    });
  }

  removeTrade(event, i) {
    let alert = this.alertCtrl.create({
      title: "Confirmar exclusão",
      message: "Tem certeza que deseja excluir o trade?",
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
            this.removeTradesList.push(this.tradesList[i]);
            this.tradesList.splice(i, 1);
            this.toast
              .create({
                message: "Trade removido.",
                duration: 2000,
                position: "bottom"
              })
              .present();
          }
        }
      ]
    });
    alert.present();
  }

  returnStep1() {
    this.validaCadastro.setEnableStep1(true);
    this.validaCadastro.setEnableStep2(false);
    localStorage.setItem("travelplan", JSON.stringify(this.tp));
    this.navCtrl.parent.select(0);
  }
}
