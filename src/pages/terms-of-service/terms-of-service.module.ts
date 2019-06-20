import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsOfServicePage } from './terms-of-service';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TermsOfServicePage,
  ],
  imports: [
    IonicPageModule.forChild(TermsOfServicePage),
    TranslateModule.forChild()
  ],
})
export class TermsOfServicePageModule {}
