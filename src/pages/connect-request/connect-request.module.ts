import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConnectRequestPage } from './connect-request';

@NgModule({
  declarations: [
    ConnectRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(ConnectRequestPage),
  ],
})
export class ConnectRequestPageModule {}
