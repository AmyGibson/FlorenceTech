import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenericCommPage } from './generic-comm';

@NgModule({
  declarations: [
    GenericCommPage,
  ],
  imports: [
    IonicPageModule.forChild(GenericCommPage),
  ],
})
export class GenericCommPageModule {}
