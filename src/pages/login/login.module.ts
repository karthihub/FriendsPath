import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LoginPage } from './login';
import { IonicPageModule } from 'ionic-angular';

@NgModule({

  declarations: [LoginPage],
  imports: [IonicPageModule.forChild(LoginPage)],
  entryComponents: [LoginPage]
})
export class LoginPageModule {}
