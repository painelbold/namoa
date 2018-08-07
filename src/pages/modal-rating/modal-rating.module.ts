import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalRatingPage } from './modal-rating';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    ModalRatingPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalRatingPage),
    Ionic2RatingModule
  ],
})
export class ModalRatingPageModule {}
