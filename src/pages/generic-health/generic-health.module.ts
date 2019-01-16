import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenericHealthPage } from './generic-health';

@NgModule({
  declarations: [
    GenericHealthPage,
  ],
  imports: [
    IonicPageModule.forChild(GenericHealthPage),
  ],
})
export class GenericHealthPageModule {}
