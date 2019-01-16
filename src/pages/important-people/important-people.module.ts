import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportantPeoplePage } from './important-people';

@NgModule({
  declarations: [
    ImportantPeoplePage,
  ],
  imports: [
    IonicPageModule.forChild(ImportantPeoplePage),
  ],
})
export class ImportantPeoplePageModule {}
