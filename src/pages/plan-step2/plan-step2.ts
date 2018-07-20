import { TravelTrade } from './../../models/travelTrade';
import { TravelPlan } from './../../models/travelPlan';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ValidaCadastroProvider } from '../../providers/valida-cadastro/valida-cadastro';

/**
 * Generated class for the PlanStep2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-plan-step2',
  templateUrl: 'plan-step2.html',
})
export class PlanStep2Page {
  tp: TravelPlan;
  minDate: any;
  minEndDate: any;
  travelTrade: TravelTrade;
  
  cidades: Array<{ id: number, descricao: string, }>;
  tpCategoria: Array<{ id: number, descricao: string, }>;
  categoria: Array<{ id: number, descricao: string, }>;
  trade: Array<{ id: number, descricao: string, }>;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private validaCadastro: ValidaCadastroProvider,
    private toast: ToastController) {
    this.tp = JSON.parse(localStorage.getItem("travelplan"));
    this.travelTrade = new TravelTrade();

    this.cidades = [
      { id: 1, descricao: "Salvador" },
      { id: 2, descricao: "Itacaré" },
      { id: 3, descricao: "Lençóis" },
      { id: 4, descricao: "Ilhéus" },
      { id: 5, descricao: "Itabuna" },
      { id: 6, descricao: "Itaparica" },
    ]

    this.tpCategoria = [
      { id:1, descricao: "Alimentação" },
      { id:2, descricao: "Cultura" },
      { id:3, descricao: "Hospedagem" },
      { id:4, descricao: "Lazer" },
      { id:5, descricao: "Transporte" },      
    ]

    this.categoria = [
      { id:1, descricao: "Cinema" },
      { id:2, descricao: "Praia" },
      { id:3, descricao: "Restaurante" },
      { id:4, descricao: "Esportes Radicais" },
      { id:5, descricao: "Museus" }, 
    ]

    this.trade = [
      { id:1, descricao: "Trade 1" },
      { id:2, descricao: "Trade 2" },
      { id:3, descricao: "Trade 3" },
      { id:4, descricao: "Trade 4" },
      { id:5, descricao: "Trade 5" }, 
    ]
  }
  
  ionViewDidLoad() {
    this.tp = JSON.parse(localStorage.getItem("travelplan"));
    this.minDate = this.tp.startDateTrip;
    this.minEndDate = this.minDate;
  }

  submitStep2(){
    if(this.tp.trades.length == 0){
      this.toast.create({message:"Pelo menos um trade deverá ser adicionado.", duration:2000, position:"bottom"}).present();
    }
    else{
      this.validaCadastro.setEnableStep2(false);
      this.validaCadastro.setEnableStep3(true);
      localStorage.setItem("travelplan", JSON.stringify(this.tp));
      this.navCtrl.parent.select(2);
    }
  }

  dtInicioChange(){
    this.minEndDate = this.travelTrade.startDateTrader;
  }

  addTrade(){
    this.tp.trades.push(this.travelTrade);
    this.travelTrade = new TravelTrade();
    this.toast.create({message:"Trade adicionado com sucesso", duration:2000, position:"bottom"}).present();
  }

}
