import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { TravelPlan } from "../../../models/travelPlan";
import {  FormGroup,  FormBuilder,  Validators } from "../../../../node_modules/@angular/forms";
import { ValidaCadastroProvider } from "../../../providers/valida-cadastro/valida-cadastro";

import {TranslateService} from '@ngx-translate/core';

/**
 * Generated class for the PlanStep1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
**/

@IonicPage()
@Component({
  selector: "page-plan-step1",
  templateUrl: "plan-step1.html"
})
export class PlanStep1Page {
  tp: TravelPlan;
  step1Form: FormGroup;
  pageTitle: string;

  minDate: any;
  minEndDate: any;
  maxCalDate: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private validaCadastro: ValidaCadastroProvider,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {

    translate.setDefaultLang(localStorage.getItem('idioma') || 'pt');
    translate.use(localStorage.getItem('idioma') || 'pt');

    this.tp = new TravelPlan();
    this.createForm();

  }

  ionViewDidLoad() {
    this.minDate = new Date().toISOString();
    this.tp = this.navParams.data;

    if(this.navParams.data.title){

      this.translate.get("MEU PLANO").subscribe(value => { 
            this.pageTitle = value
      });

    }else{
      this.translate.get("NOVO PLANO").subscribe(value => { 
            this.pageTitle = value
      });
    }
    
    this.createForm();
    this.maxCalDate = "2030-12-31";
  }

  dtInicioChange() {
    this.minEndDate = this.step1Form.controls["startDateTrip"].value;
    if(this.minEndDate > this.step1Form.controls["endDateTrip"].value){
      this.step1Form.patchValue({
        endDateTrip: ''
      });
    }
  }

  submitStep1() {
    this.step1Form.value.key = this.tp.key;
    this.validaCadastro.setEnableStep1(false);
    this.validaCadastro.setEnableStep2(true);
    localStorage.setItem("travelplan", JSON.stringify(this.step1Form.value));
    this.navCtrl.parent.select(1);
  }

  createForm() {
    this.step1Form = this.formBuilder.group({
      title: [this.tp ? this.tp.title : '', Validators.required],
      startDateTrip: [this.tp ? this.tp.startDateTrip : '', Validators.required],
      endDateTrip: [this.tp ? this.tp.endDateTrip : '', Validators.required]
    });
  }
}
