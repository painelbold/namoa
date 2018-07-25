import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelTipsPage } from './travel-tips';

@NgModule({
  declarations: [
    TravelTipsPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelTipsPage),
  ],
})
export class TravelTipsPageModule {}
