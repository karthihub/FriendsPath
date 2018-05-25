import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MyApp } from '../../app/app.component';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ToastControllerComponent } from '../../components/toast-controller/toast-controller';
import { LoadingControllerComponent } from '../../components/loading-controller/loading-controller';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public userRegistration: FormGroup;

  constructor(public navparams: NavParams, public commonService: CommonservicesProvider, private formBuilder: FormBuilder,
    private http: Http, public navCtrl: NavController, public navParams: NavParams, public mainServices: MyApp,
    public messageCtrl: ToastControllerComponent, public loadingCtrl: LoadingControllerComponent) {

    this.userRegistration = this.formBuilder.group({

      userName: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(15), Validators.required])],
      mobile: ['', Validators.compose([Validators.pattern('^[0-9+]{13,15}$'), Validators.minLength(13), Validators.maxLength(15), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(12), Validators.required])]
    });

  }

  signinPageNavigation() {
    this.mainServices.signinNavigate();
  }

  userRegisteration() {
    this.loadingCtrl.presentLoadingWindow('Please Wait');

    this.userRegistration.value.fcmTocken = this.mainServices.fcmTocken;
    this.userRegistration.value.devicePlatform = this.mainServices.devicePlatform;
    this.userRegistration.value.deviceUUID = this.mainServices.deviceUUID;

    let headers = new Headers(
      {
        'Content-Type': 'application/json',
      });

    let options = new RequestOptions({ headers: headers });

    //Post method to send register data
    this.http.post(this.commonService.api + '/' + this.commonService.empRegistration + '/', this.userRegistration.value, options)
      .subscribe((res: any) => {
        console.log("res" + res);
        let success = JSON.parse(res._body);

        switch (success.status) {
          case 200:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "greenClr");
            this.navCtrl.setRoot("LoginPage");
            break;
          case 401:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "redClr");
            break;
        }
        console.log(JSON.stringify(success));
      }
      );


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}
