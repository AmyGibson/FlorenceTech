import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SomethingToDoListPage } from './something-to-do-list';

@NgModule({
  declarations: [
    SomethingToDoListPage,
  ],
  imports: [
    IonicPageModule.forChild(SomethingToDoListPage),
  ],
})
export class SomethingToDoListPageModule {}
