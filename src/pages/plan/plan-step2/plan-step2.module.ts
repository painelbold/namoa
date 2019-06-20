import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanStep2Page } from './plan-step2';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PlanStep2Page,
  ],
  imports: [
    IonicPageModule.forChild(PlanStep2Page),
    TranslateModule.forChild()
  ],
})
export class PlanStep2PageModule {}
