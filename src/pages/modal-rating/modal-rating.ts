import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
  rate: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.rate='';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalRatingPage');
  }

  closeModal(){
    console.log("closeModal");
    this.viewCtrl.dismiss();
  }

}
