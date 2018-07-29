import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelPlansListPage } from './travel-plans-list';
import { ReversePipe } from '../../pipes/reverse/reverse';

@NgModule({
  declarations: [
    TravelPlansListPage,
    ReversePipe
  ],
  imports: [
    IonicPageModule.forChild(TravelPlansListPage),
  ],
})
export class TravelPlansListPageModule {}
