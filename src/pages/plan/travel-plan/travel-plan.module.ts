import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelPlanPage } from './travel-plan';

@NgModule({
  declarations: [
    TravelPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelPlanPage),
  ],
})
export class TravelPlanPageModule {}
