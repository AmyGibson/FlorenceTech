import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConnectPublicPage } from './connect-public';

@NgModule({
  declarations: [
    ConnectPublicPage,
  ],
  imports: [
    IonicPageModule.forChild(ConnectPublicPage),
  ],
})
export class ConnectPublicPageModule {}
