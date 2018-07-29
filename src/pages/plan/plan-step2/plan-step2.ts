import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { TravelPlan } from '../../../models/travelPlan';
import { TravelTrade } from '../../../models/travelTrade';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { ValidaCadastroProvider } from '../../../providers/valida-cadastro/valida-cadastro';

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
  travelTrade: TravelTrade;
  step2Form: FormGroup;

  minDate: any;
  minEndDate: any;

  cidades: Array<{ id: number, descricao: string, }>;
  tpCategoria: Array<{ id: number, descricao: string, }>;
  categoria: Array<{ id: number, descricao: string, }>;
  trade: Array<{ id: number, descricao: string, }>;
  tradePrice: Array<number>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private validaCadastro: ValidaCadastroProvider,
    private toast: ToastController,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController) {

    this.tp = JSON.parse(localStorage.getItem("travelplan"));
    this.tp.trades = new Array<TravelTrade>();
    this.travelTrade = new TravelTrade();
    this.createForm();


    this.populateDropdowns();
  }

  private populateDropdowns() {
    this.cidades = [
      { id: 1, descricao: "Salvador" },
      { id: 2, descricao: "Itacaré" },
      { id: 3, descricao: "Lençóis" },
      { id: 4, descricao: "Ilhéus" },
      { id: 5, descricao: "Itabuna" },
      { id: 6, descricao: "Itaparica" },
    ];
    this.tpCategoria = [
      { id: 1, descricao: "Alimentação" },
      { id: 2, descricao: "Cultura" },
      { id: 3, descricao: "Hospedagem" },
      { id: 4, descricao: "Lazer" },
      { id: 5, descricao: "Transporte" },
    ];
    this.categoria = [
      { id: 1, descricao: "Cinema" },
      { id: 2, descricao: "Praia" },
      { id: 3, descricao: "Restaurante" },
      { id: 4, descricao: "Esportes Radicais" },
      { id: 5, descricao: "Museus" },
    ];
    this.trade = [
      { id: 1, descricao: "Trade 1" },
      { id: 2, descricao: "Trade 2" },
      { id: 3, descricao: "Trade 3" },
      { id: 4, descricao: "Trade 4" },
      { id: 5, descricao: "Trade 5" },
    ];
    this.tradePrice = [
      100, 50, 20, 60, 200, 300, 40, 15
    ];
  }

  ionViewDidLoad() {
    this.minDate = this.tp.startDateTrip;
    this.step2Form.patchValue({
      startDateTrader: this.minDate
    });
    this.minEndDate = this.minDate;
    this.tp.trades = new Array<TravelTrade>();
  }

  submitStep2(){
    this.validaCadastro.setEnableStep2(false);
    this.validaCadastro.setEnableStep3(true);
    localStorage.setItem("travelplan", JSON.stringify(this.tp));
    this.navCtrl.parent.select(2);
  }

  dtInicioChange(){
    this.minEndDate = this.step2Form.controls["startDateTrader"].value;
  }

  addTrade(){
    this.travelTrade = this.step2Form.value;
    this.travelTrade.avgPrice = this.tradePrice[Math.floor(Math.random() * this.tradePrice.length)];
    this.tp.trades.push(this.travelTrade);
    this.travelTrade = new TravelTrade();
    this.createForm();
    this.toast.create({message:"Trade adicionado com sucesso", duration:2000, position:"bottom"}).present();
  }

  createForm(){
    this.step2Form = this.formBuilder.group({
      city: ['', Validators.required],
      categoryType: ['', Validators.required],
      category: ['', Validators.required],
      trade: ['', Validators.required],
      startDateTrader: ['', Validators.required],
      endDateTrader: ['', Validators.required],
    });
  }

  removeTrade(event, i){
    let alert = this.alertCtrl.create({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir o trade?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.tp.trades.splice(i, 1);
            this.toast.create({message: "Trade removido.", duration: 2000, position:"bottom"}).present();
          }
        }
      ]
    });
    alert.present();
  }

  returnStep1(){
    this.validaCadastro.setEnableStep1(true);
    this.validaCadastro.setEnableStep2(false);
    localStorage.setItem("travelplan", JSON.stringify(this.tp));
    this.navCtrl.parent.select(0);
  }

}
