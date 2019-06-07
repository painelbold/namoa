import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Http } from '@angular/http';
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

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalQuestionarioPage');
    this.getEstado();
    this.getTrade();
  }

  getEstado(){
      this.http.get('http://namoa.vivainovacao.com/api/home/estado/').map(res => res.json()).subscribe(data => {
          this.estados = data[0];
      });
  }

  getCidades(estado){
    this.http.get('http://namoa.vivainovacao.com/api/home/filtercidades/'+estado).map(res => res.json()).subscribe(data => {
        this.cidades = data[0];
    });
  }

  getTrade(){
    this.http.get('http://namoa.vivainovacao.com/api/home/trade/').map(res => res.json()).subscribe(data => {
          this.trade = data[0];
      });
  }

  responderQuestionario() {

    console.log("formQuestionario", this.formQuestionario)

    this.viewCtrl.dismiss({ retorno: true });
  }

}
