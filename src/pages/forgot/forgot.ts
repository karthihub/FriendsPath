import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { ToastControllerComponent } from '../../components/toast-controller/toast-controller';
import { LoadingControllerComponent } from '../../components/loading-controller/loading-controller';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';

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

  public userForgot: FormGroup;

  constructor(public navparams: NavParams, public commonService: CommonservicesProvider, private formBuilder: FormBuilder,
    private http: Http, public navCtrl: NavController, public navParams: NavParams, public mainServices: MyApp,
    public messageCtrl: ToastControllerComponent, public loadingCtrl: LoadingControllerComponent,
    private geolocation: Geolocation) {

    this.userForgot = this.formBuilder.group({
      otp: ['', Validators.compose([Validators.pattern('^[0-9]{6}$'), Validators.minLength(6), Validators.maxLength(6), Validators.required])],
      newPassword: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(12), Validators.required])]
    });

  }

  forgotPasswordBTN() {
    this.loadingCtrl.presentLoadingWindow('Please Wait');
    this.userForgot.value.deviceUUID = this.mainServices.deviceUUID;
    let headers = new Headers({ 'Content-Type': 'application/json', });
    let options = new RequestOptions({ headers: headers });
    this.http.post(this.commonService.api + '/' + this.commonService.useForgotPass + '/', this.userForgot.value , options)
      .subscribe((res: any) => {
        console.log("res" + res);
        let success = JSON.parse(res._body);
        switch (success.status) {
          case 200:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "redClr");
            this.navCtrl.setRoot('LoginPage');
            break;
          case 401:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "redClr");
            break;
        }
        console.log(JSON.stringify(success));
      });
  }

  signInPage(){
    this.navCtrl.setRoot('LoginPage');
  }

}
