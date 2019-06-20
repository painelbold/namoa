import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelTipsPage } from './travel-tips';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TravelTipsPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelTipsPage),
    TranslateModule.forChild()
  ],
})
export class TravelTipsPageModule {}
