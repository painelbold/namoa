import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelPlansListPage } from './travel-plans-list';

@NgModule({
  declarations: [
    TravelPlansListPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelPlansListPage),
  ],
})
export class TravelPlansListPageModule {}
