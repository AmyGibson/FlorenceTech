import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditNoPhotoModalPage } from './edit-no-photo-modal';

@NgModule({
  declarations: [
    EditNoPhotoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(EditNoPhotoModalPage),
  ],
})
export class EditNoPhotoModalPageModule {}
