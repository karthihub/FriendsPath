import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the LoadingControllerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'loading-controller',
  templateUrl: 'loading-controller.html'
})
export class LoadingControllerComponent {

  text: string;
  public loader: any;

  constructor(public loadingCtrl: LoadingController) {
    console.log('Hello LoadingControllerComponent Component');
    this.text = 'Hello World';
  }

  presentLoadingWindow(message) {
    this.loader = "";
    this.loader = this.loadingCtrl.create({
      spinner: 'crescent',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>`,
      // duration: 5000
    });

    this.loader.present();
  }

  dismissLoadingWindow() {
    this.loader.dismiss()
  }

}
