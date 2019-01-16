import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeneralRoutinePage } from './general-routine';

@NgModule({
  declarations: [
    GeneralRoutinePage,
  ],
  imports: [
    IonicPageModule.forChild(GeneralRoutinePage),
  ],
})
export class GeneralRoutinePageModule {}
