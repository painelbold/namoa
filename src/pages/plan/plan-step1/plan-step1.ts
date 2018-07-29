import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TravelPlan } from '../../../models/travelPlan';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { ValidaCadastroProvider } from '../../../providers/valida-cadastro/valida-cadastro';


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
  tp: TravelPlan;
  step1Form: FormGroup;

  minDate: any;
  minEndDate: any;
  maxCalDate: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private validaCadastro: ValidaCadastroProvider,
    private formBuilder: FormBuilder) {
      this.createForm();
    }

    ionViewDidLoad() {
      this.minDate = new Date().toISOString();
      this.tp = new TravelPlan();
      this.maxCalDate = "2030-12-31"
  }

  dtInicioChange(){
    this.minEndDate = this.step1Form.controls["startDateTrip"].value;
  }

  submitStep1(){
    this.tp = this.step1Form.value;
    this.validaCadastro.setEnableStep1(false);
    this.validaCadastro.setEnableStep2(true);
    localStorage.setItem("travelplan", JSON.stringify(this.tp));
    this.navCtrl.parent.select(1);
  }

  createForm(){
    this.step1Form = this.formBuilder.group({
      title: ['', Validators.required],
      startDateTrip: ['', Validators.required],
      endDateTrip: ['', Validators.required],
    });
  }


}