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
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public userLoginData: FormGroup;

  constructor(public navparams: NavParams, public commonService: CommonservicesProvider, private formBuilder: FormBuilder,
              private http: Http, public navCtrl: NavController, public navParams: NavParams, public mainServices: MyApp,
              public messageCtrl: ToastControllerComponent, public loadingCtrl: LoadingControllerComponent,
              private geolocation: Geolocation) {

                this.userLoginData = this.formBuilder.group({

                  userName: ['krish', Validators.compose([Validators.minLength(4), Validators.maxLength(15), Validators.required])],
                  password: ['karthi@123', Validators.compose([Validators.minLength(8), Validators.maxLength(12), Validators.required])]
                });
  }

  signupPageNavigation(){
    this.mainServices.signupNavigate();
  }

  forgotPageNavigation(){
    this.mainServices.forgotNavigate();
  }

  signInPageNavigation(){

    this.geolocation.getCurrentPosition().then((location) => {
      this.loadingCtrl.presentLoadingWindow('Please Wait');
      console.log("Current location : ", location);
      this.userLoginData.value.latitude =  location.coords.latitude;
      this.userLoginData.value.longitude =  location.coords.longitude;

      let headers = new Headers(
        {
          'Content-Type': 'application/json',
        });
  
      let options = new RequestOptions({ headers: headers });
  
      //Post method to send register data
      this.http.post(this.commonService.api + '/' + this.commonService.useAuthendication + '/', this.userLoginData.value, options)
        .subscribe((res: any) => {
          console.log("res" + res);
          let success = JSON.parse(res._body);
  
          switch (success.status) {
            case 200:
              this.loadingCtrl.dismissLoadingWindow();
              this.messageCtrl.presentToast(success.message, "greenClr");
              localStorage.setItem('userID', success.body[0].userID);
              localStorage.setItem('userName', success.body[0].userName);
              this.navCtrl.setRoot("HomePage");
              break;
            case 401:
              this.loadingCtrl.dismissLoadingWindow();
              this.messageCtrl.presentToast(success.message, "redClr");
              break;
          }
          console.log(JSON.stringify(success));
        }
        );
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
