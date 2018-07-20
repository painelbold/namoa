import { ValidaCadastroProvider } from './../../providers/valida-cadastro/valida-cadastro';
import { PlanStep3Page } from './../plan-step3/plan-step3';
import { PlanStep2Page } from './../plan-step2/plan-step2';
import { PlanStep1Page } from './../plan-step1/plan-step1';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TravelPlanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-travel-plan',
  templateUrl: 'travel-plan.html',
})
export class TravelPlanPage {
  step1TAB = PlanStep1Page;
  step2TAB = PlanStep2Page;
  step3TAB = PlanStep3Page;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private cadastro: ValidaCadastroProvider) {
      this.cadastro.setEnableStep1(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelPlanPage');
  }

  getEnableStep1(){
    return this.cadastro.getEnableStep1();
  }

  getEnableStep2(){
    return this.cadastro.getEnableStep2();
  }
  getEnableStep3(){
    return this.cadastro.getEnableStep3();
  }
  
  ionViewWillEnter(){
    this.cadastro.setEnableStep1(true);
    this.cadastro.setEnableStep2(false);
    this.cadastro.setEnableStep3(false);
  }

  cadastroInfracao(){

  }

}
