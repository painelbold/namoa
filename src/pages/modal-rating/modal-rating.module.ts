import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalRatingPage } from './modal-rating';
import { Ionic2RatingModule } from 'ionic2-rating';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalRatingPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalRatingPage),
    TranslateModule.forChild(),
    Ionic2RatingModule
  ],
})
export class ModalRatingPageModule {}
