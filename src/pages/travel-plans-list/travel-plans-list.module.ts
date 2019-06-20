import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelPlansListPage } from './travel-plans-list';
import { ReversePipe } from '../../pipes/reverse/reverse';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TravelPlansListPage,
    ReversePipe
  ],
  imports: [
    IonicPageModule.forChild(TravelPlansListPage),
    TranslateModule.forChild()
  ],
})
export class TravelPlansListPageModule {}
