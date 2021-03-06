import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PlanStep1Page } from './../plan-step1/plan-step1';
import { PlanStep2Page } from './../plan-step2/plan-step2';
import { PlanStep3Page } from './../plan-step3/plan-step3';
import { ValidaCadastroProvider } from '../../../providers/valida-cadastro/valida-cadastro';
import { TravelPlan } from '../../../models/travelPlan';

import {TranslateService} from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-travel-plan',
  templateUrl: 'travel-plan.html',
})
export class TravelPlanPage {
  step1TAB = PlanStep1Page;
  step2TAB = PlanStep2Page;
  step3TAB = PlanStep3Page;
  editTravelPlan: TravelPlan;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private cadastro: ValidaCadastroProvider,
    translate: TranslateService) {
      this.editTravelPlan = this.navParams.get("editTravelPlan");
      this.cadastro.setEnableStep1(true);

      translate.setDefaultLang(localStorage.getItem('idioma') || 'pt');
      translate.use(localStorage.getItem('idioma') || 'pt');
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

}
