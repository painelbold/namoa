import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalQuestionarioPage } from './modal-questionario';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalQuestionarioPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalQuestionarioPage),
    TranslateModule.forChild()
  ],
})
export class ModalQuestionarioPageModule {}
