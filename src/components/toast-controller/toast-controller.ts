import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the ToastControllerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'toast-controller',
  templateUrl: 'toast-controller.html'
})
export class ToastControllerComponent {

  text: string;
  public toster: any;

  constructor(private toastCtrl: ToastController) {
    console.log('Hello ToastControllerComponent Component');
    this.text = 'Hello World';
  }


  presentToast(message, cssClass) {
    this.toster = "";
    this.toster = this.toastCtrl.create({
      message: message,
      duration: 4000,
      // showCloseButton: true,
      position: 'top',
      cssClass: cssClass
    });

    this.toster.present();
  }

  dismissToster() {
    this.toster.dismiss()
  }

  // this.toster.onDidDismiss(() => {
  //     console.log('Dismissed toast');
  //   });

}
