import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Loading, LoadingController } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the ModalQuestionarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-questionario',
  templateUrl: 'modal-questionario.html',
})
export class ModalQuestionarioPage {

  formQuestionario = { 
  		q1: '', q2: '', q3: '', q4: '', q5: '', q6: '',
  		q7: '', q8: '', q9: '', q10: '', q11: '',
  		q12_1: '', q12_2: '', q12_3: '', q12_4: '', q12_5: '', q12_6: '', q12_7: '',
  		q13_1: '', q13_2: '', q13_3: '', q13_4: '', q13_5: '', q13_6: '', q13_7: '',
  		q14_1: '', q14_2: '', q14_3: '', q14_4: '', q14_5: '', q15: '', q16: '', q17: ''
  };

  cidades: Array<{ id: number; descricao: string }> = [];
  trade: Array<{ id: number; descricao: string }> = [];
  estados: Array<{ nome_estado: string, sigla_estado: string} > = [];
  loading: Loading;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public http: Http, private loadingCtrl: LoadingController,) {
  }

  createLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Carregando..."
    });
    this.loading.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalQuestionarioPage');
    this.getEstado();
    this.getTrade();
  }

  getEstado(){

  		this.createLoading();

	    this.http.get('http://namoa.vivainovacao.com/api/home/estado/').map(res => res.json()).subscribe(data => {
	        this.estados = data[0];
	        this.loading.dismiss();
		    },err =>{
	          this.loading.dismiss();
	          this.getEstado();
	    });
  }

  getCidades(estado){

  	if(estado!=""){
  		this.createLoading();
  		this.http.get('http://namoa.vivainovacao.com/api/home/filtercidades/'+estado).map(res => res.json()).subscribe(data => {
	        this.cidades = data[0];
	        this.loading.dismiss();
	    },err =>{
          this.loading.dismiss();
          this.getCidades(estado);
        });
  	}

  }

  getTrade(){

    this.http.get('http://namoa.vivainovacao.com/api/home/allTrade/').map(res => res.json()).subscribe(data => {
          this.trade = data[0];
    },err =>{
	      this.getTrade();
    });
  }

  responderQuestionario() {

  	if(this.formQuestionario.q1!='' && this.formQuestionario.q2!='' && this.formQuestionario.q3!='' && this.formQuestionario.q4!='' && this.formQuestionario.q5!='' && this.formQuestionario.q6!='' && this.formQuestionario.q7!='' && this.formQuestionario.q8!='' && this.formQuestionario.q9!='' && this.formQuestionario.q10!='' && this.formQuestionario.q11!='' && this.formQuestionario.q12_1!='' && this.formQuestionario.q12_2!='' && this.formQuestionario.q12_3!='' && this.formQuestionario.q12_4!='' && this.formQuestionario.q12_5!='' && this.formQuestionario.q12_6!='' && this.formQuestionario.q12_7!='' && this.formQuestionario.q13_1!='' && this.formQuestionario.q13_2!='' && this.formQuestionario.q13_3!='' && this.formQuestionario.q13_4!='' && this.formQuestionario.q13_5!='' && this.formQuestionario.q13_6!='' && this.formQuestionario.q13_7!='' && this.formQuestionario.q14_1!='' && this.formQuestionario.q14_2!='' && this.formQuestionario.q14_3!='' && this.formQuestionario.q14_4!='' && this.formQuestionario.q14_5!='' && this.formQuestionario.q15!='' && this.formQuestionario.q16!='' && this.formQuestionario.q17!=''){

	    const payload_questionario = {
			 "questao1" : this.formQuestionario.q1,
		     "questao2" : this.formQuestionario.q2,
		     "questao3" : this.formQuestionario.q3,
		     "questao4" : this.formQuestionario.q4,
		     "questao5" : this.formQuestionario.q5,
		     "questao6" : this.formQuestionario.q6,
		     "questao7" : this.formQuestionario.q7,
		     "questao8" : this.formQuestionario.q8,
		     "questao9" : this.formQuestionario.q9,
		     "questao10" : this.formQuestionario.q10,
		     "questao11" : this.formQuestionario.q11,
		     "questao12_1" : this.formQuestionario.q12_1,
		     "questao12_2" : this.formQuestionario.q12_2,
		     "questao12_3" : this.formQuestionario.q12_3,
		     "questao12_4" : this.formQuestionario.q12_4,
		     "questao12_5" : this.formQuestionario.q12_5,
		     "questao12_6" : this.formQuestionario.q12_6,
		     "questao12_7" : this.formQuestionario.q12_7,
		     "questao13_1" : this.formQuestionario.q13_1,
		     "questao13_2" : this.formQuestionario.q13_2,
		     "questao13_3" : this.formQuestionario.q13_3,
		     "questao13_4" : this.formQuestionario.q13_4,
		     "questao13_5" : this.formQuestionario.q13_5,
		     "questao13_6" : this.formQuestionario.q13_6,
		     "questao13_7" : this.formQuestionario.q13_7,
		     "questao14_1" : this.formQuestionario.q14_1,
		     "questao14_2" : this.formQuestionario.q14_2,
		     "questao14_3" : this.formQuestionario.q14_3,
		     "questao14_4" : this.formQuestionario.q14_4,
		     "questao14_5" : this.formQuestionario.q14_5,
		     "questao15" : this.formQuestionario.q15,
		     "questao16" : this.formQuestionario.q16,
		     "questao17" : this.formQuestionario.q17,
		     "usuario": ""
		 }

		localStorage.setItem("payload_questionario",JSON.stringify(payload_questionario));
	  
		this.viewCtrl.dismiss({ retorno: true });
		  
    	}else{
    		alert("Por favor, preencha todos os campos.");
    	}
  }

}
