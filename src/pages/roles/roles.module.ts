import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RolesPage } from './roles';

@NgModule({
  declarations: [
    RolesPage,
  ],
  imports: [
    IonicPageModule.forChild(RolesPage),
  ],
})
export class RolesPageModule {}
