import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewGroupPage } from './add-new-group';

@NgModule({
  declarations: [
    AddNewGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewGroupPage),
  ],
})
export class AddNewGroupPageModule {}
