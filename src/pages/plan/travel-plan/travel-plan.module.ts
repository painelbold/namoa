import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelPlanPage } from './travel-plan';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TravelPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelPlanPage),
    TranslateModule.forChild()
  ],
})
export class TravelPlanPageModule {}
