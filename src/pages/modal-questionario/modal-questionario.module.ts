import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalQuestionarioPage } from './modal-questionario';

@NgModule({
  declarations: [
    ModalQuestionarioPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalQuestionarioPage),
  ],
})
export class ModalQuestionarioPageModule {}
