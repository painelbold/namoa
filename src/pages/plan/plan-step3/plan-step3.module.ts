import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanStep3Page } from './plan-step3';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PlanStep3Page,
  ],
  imports: [
    IonicPageModule.forChild(PlanStep3Page),
    TranslateModule.forChild()
  ],
})
export class PlanStep3PageModule {}
