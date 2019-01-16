import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HealthListPage } from './health-list';

@NgModule({
  declarations: [
    HealthListPage,
  ],
  imports: [
    IonicPageModule.forChild(HealthListPage),
  ],
})
export class HealthListPageModule {}
