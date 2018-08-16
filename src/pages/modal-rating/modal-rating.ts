import { TradeRating } from './../../models/tradeRating';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, Loading, LoadingController } from 'ionic-angular';

import { TravelTradeRatingProvider } from './../../providers/travel-trade-rating/travel-trade-rating';

/**
 * Generated class for the ModalRatingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-rating',
  templateUrl: 'modal-rating.html',
})
export class ModalRatingPage {
  rate: number;
  allRatesTrade: Array<TradeRating>;
  dateRating: TradeRating;
  prevRate: any;
  date: string;
  uid: string;
  trade: string;
  loading: Loading;
  avgRating: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private ttrProvider: TravelTradeRatingProvider,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController) {
      this.rate = 3;
      this.allRatesTrade = new Array<TradeRating>();
      this.date = this.navParams.get("rateDate");
      this.uid = this.navParams.get("userId");
      this.trade = this.navParams.get("trade");
      this.avgRating = 0;
      this.getRating();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalRatingPage');
  }

  closeModal(){
    console.log("closeModal");
    this.viewCtrl.dismiss();
  }

  saveRating(){
    console.log("saveRating", this.date, this.uid, this.rate, this.trade);
    this.ttrProvider.rateTrade(this.date,this.uid, this.rate, this.trade)
    .then(()=>{
      this.toastCtrl.create({
        duration: 2000,
        message: "Avaliação do trade registrada!",
        position: "bottom"
      })
      .present();
      this.closeModal();
    })
    .catch((error)=>{
      this.toastCtrl.create({
        duration: 2000,
        message: "Erro ao avaliar o trade.",
        position: "bottom"
      })
      .present();
      console.log("Erro ao avaliar o trade: " + error.code);
    });
  }

  getRating(){
    this.createLoading();
    const subscribe = this.ttrProvider.getAllTradeRates(this.trade)
    .subscribe((rating: any) => {
      this.allRatesTrade = rating;
      this.allRatesTrade.map((item) => this.avgRating += item.rating);

      this.dateRating = this.allRatesTrade.filter((r) => r.user_date == this.uid + "_" + this.date)[0]

      this.loading.dismiss();
      subscribe.unsubscribe();
    })
  }

  createLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Carregando avaliação..."
    });
    this.loading.present();
  }

}
