import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LifeHistoryListPage } from './life-history-list';

@NgModule({
  declarations: [
    LifeHistoryListPage,
  ],
  imports: [
    IonicPageModule.forChild(LifeHistoryListPage),
  ],
})
export class LifeHistoryListPageModule {}
