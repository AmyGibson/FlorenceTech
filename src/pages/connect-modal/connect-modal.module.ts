import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConnectModalPage } from './connect-modal';

@NgModule({
  declarations: [
    ConnectModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ConnectModalPage),
  ],
})
export class ConnectModalPageModule {}
