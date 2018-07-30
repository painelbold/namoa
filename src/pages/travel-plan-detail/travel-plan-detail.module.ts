import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelPlanDetailPage } from './travel-plan-detail';

@NgModule({
  declarations: [
    TravelPlanDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelPlanDetailPage),
  ],
})
export class TravelPlanDetailPageModule {}
