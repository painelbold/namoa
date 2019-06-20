import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacyPage } from './privacy';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PrivacyPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivacyPage),
    TranslateModule.forChild()
  ],
})
export class PrivacyPageModule {}
