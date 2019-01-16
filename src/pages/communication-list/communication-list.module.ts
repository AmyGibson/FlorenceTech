import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunicationListPage } from './communication-list';

@NgModule({
  declarations: [
    CommunicationListPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunicationListPage),
  ],
})
export class CommunicationListPageModule {}
