import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the ForgotPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {

  public userForgot : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public mainFunction: MyApp) {

    this.userForgot = this.formBuilder.group({
      mobile:     ['', Validators.compose([Validators.pattern('^[0-9+]{13,15}$'),Validators.minLength(13), Validators.maxLength(15), Validators.required])],
      newPassword:   ['', Validators.compose([Validators.minLength(8), Validators.maxLength(12), Validators.required])]
    });

  }

  signinPageNavigation(){
    this.mainFunction.signinNavigate();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPage');
  }

}
