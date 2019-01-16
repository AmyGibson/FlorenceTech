import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalEventModalPage } from './cal-event-modal';

@NgModule({
  declarations: [
    CalEventModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CalEventModalPage),
  ],
})
export class CalEventModalPageModule {}
