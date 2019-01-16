import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpecificRoutinesPage } from './specific-routines';
import { NgCalendarModule } from 'ionic2-calendar';

@NgModule({
  declarations: [
    SpecificRoutinesPage,
  ],
  imports: [
    NgCalendarModule,
    IonicPageModule.forChild(SpecificRoutinesPage),
  ],
})
export class SpecificRoutinesPageModule {}
