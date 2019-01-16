import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoutineListPage } from './routine-list';

@NgModule({
  declarations: [RoutineListPage],
  imports: [IonicPageModule.forChild(RoutineListPage)],
  //exports: [RoutineListPage]
})
export class RoutineListPageModule { }