import { NgModule } from '@angular/core';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { ForgotPage } from './forgot';

@NgModule({
  declarations: [
    ForgotPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotPage),
  ],
  exports: [
    ForgotPage
  ]
})
export class ForgotPageModule {}
