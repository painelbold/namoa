import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelPlanDetailPage } from './travel-plan-detail';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TravelPlanDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelPlanDetailPage),
    TranslateModule.forChild()
  ],
})
export class TravelPlanDetailPageModule {}
