import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {TranslateService} from '@ngx-translate/core';

/**
 * Generated class for the TermsOfServicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terms-of-service',
  templateUrl: 'terms-of-service.html',
})
export class TermsOfServicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, translate: TranslateService) {

  	translate.setDefaultLang(localStorage.getItem('idioma') || 'pt');
    translate.use(localStorage.getItem('idioma') || 'pt');
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsOfServicePage');
  }

}
