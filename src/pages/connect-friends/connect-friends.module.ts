import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConnectFriendsPage } from './connect-friends';

@NgModule({
  declarations: [
    ConnectFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(ConnectFriendsPage),
  ],
})
export class ConnectFriendsPageModule {}
