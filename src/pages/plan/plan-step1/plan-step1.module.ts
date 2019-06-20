import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanStep1Page } from './plan-step1';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PlanStep1Page,
  ],
  imports: [
    IonicPageModule.forChild(PlanStep1Page),
    TranslateModule.forChild()
  ],
})
export class PlanStep1PageModule {}
