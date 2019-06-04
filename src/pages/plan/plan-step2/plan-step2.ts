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

import { Http } from '@angular/http';
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

  cidades: Array<{ id: number; descricao: string }>;
  tpCategoria: Array<{ id: number; descricao: string }>;
  categoria: Array<{ id: number; descricao: string }>;
  trade: Array<{ id: number; descricao: string }>;
  tradePrice: Array<number>;
  estados: Array<{ nome_estado: string, sigla_estado: string} >;

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
    this.createForm();
    this.setupPageTitle();

    this.loadTrades();

    this.populateDropdowns();
  }

  createLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Carregando trades..."
    });
    this.loading.present();
  }


  private loadTrades(){
    if(this.tp.key){
      this.createLoading();
      const subscribe = this.tptProvider.getAllByStartDate(this.tp.key)
      .subscribe((tList: any)=>{
        this.tradesList = tList;
        this.loading.dismiss();
        subscribe.unsubscribe();
      });
    }
  }

  private populateDropdowns() {
    
    this.estados = [];
    this.cidades = [];
    this.tpCategoria = [];
    this.categoria = [];

    this.trade = [];
    this.tradePrice = [100, 50, 20, 60, 200, 300, 40, 15];
  }

  private setupPageTitle(){
    this.formTitle = this.tp.key ? 'Editar plano' : 'Novo Plano';
  }

  ionViewDidLoad() {

    this.getEstado();
    this.getTipoCategoria();
    this.getTrade();
    this.minDate = this.tp.startDateTrip;
    this.step2Form.patchValue({
      startDateTrader: this.minDate
    });
    this.minEndDate = this.minDate;
    this.tradesList = new Array<TravelTrade>();
    this.addTradesList = new Array<TravelTrade>();
    this.removeTradesList = new Array<TravelTrade>();
  }

  getEstado(){
    // console.log("getEstado");

      this.http.get('http://namoa.vivainovacao.com/api/home/estado/').map(res => res.json()).subscribe(data => {
          // console.log("data",data[0]);
          this.estados = data[0];
      });

  }

  getCidades(estado){

    // console.log("Estado Selecionado",estado);

    this.http.get('http://namoa.vivainovacao.com/api/home/filtercidades/'+estado).map(res => res.json()).subscribe(data => {
        // console.log("data",data[0]);
        this.cidades = data[0];
    });

  }

  getTipoCategoria(){
    // console.log("getTipoCategoria")

      this.http.get('http://namoa.vivainovacao.com/api/home/tipoCategorias/').map(res => res.json()).subscribe(data => {
          // console.log("data",data[0]);
          this.tpCategoria = data[0];
          // console.log("this.tpCategoria",this.tpCategoria)
      });

  }

  getCategoria(tipo){

    // console.log("Estado Selecionado",tipo);

    this.http.get('http://namoa.vivainovacao.com/api/home/categorias/'+tipo).map(res => res.json()).subscribe(data => {
        // console.log("data",data[0]);
        this.categoria = data[0];
    });

  }

  getTrade(){
    // console.log("getTrade")

    this.http.get('http://namoa.vivainovacao.com/api/home/trade/').map(res => res.json()).subscribe(data => {
          // console.log("data",data[0]);
          this.trade = data[0];
          // console.log("this.trade",this.trade)
      });

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

  addTrade() {
    this.travelTrade = this.step2Form.value;
    this.travelTrade.avgPrice = this.tradePrice[
      Math.floor(Math.random() * this.tradePrice.length)
    ];
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
