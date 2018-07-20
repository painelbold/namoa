import { PlanStep2Page } from './../plan-step2/plan-step2';
import { ValidaCadastroProvider } from './../../providers/valida-cadastro/valida-cadastro';
import { TravelPlan } from './../../models/travelPlan';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { FormBuilder, FormGroup } from '../../../node_modules/@angular/forms';
import { TravelTrade } from '../../models/travelTrade';

/**
 * Generated class for the PlanStep1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-plan-step1',
  templateUrl: 'plan-step1.html',
})
export class PlanStep1Page {
  minDate: any;
  minEndDate: any;
  tp: TravelPlan;
  fgPlanStep1: FormGroup;
  startDate = DateTime;
  endDate = DateTime;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private validaCadastro: ValidaCadastroProvider) {
    this.tp = new TravelPlan();
    this.tp.trades = new Array<TravelTrade>();
  }

  ionViewDidLoad() {
    this.minDate = new Date().toISOString();
    this.minEndDate = this.minDate;
  }

  dtInicioChange(){
    this.minEndDate = this.tp.startDateTrip;
  }

  submitStep1(){
    this.validaCadastro.setEnableStep1(false);
    this.validaCadastro.setEnableStep2(true);
    localStorage.setItem("travelplan", JSON.stringify(this.tp));
    this.navCtrl.parent.select(1);
  }



}
