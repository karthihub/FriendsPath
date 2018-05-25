import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    AgmCoreModule.forRoot({apiKey: 'AIzaSyA6AeYiGPCbjJXtblgpEZCg81uJlsoqJB0'})
  ],
})
export class HomePageModule {}
