import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Device } from '@ionic-native/device';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';

declare var FirebasePlugin: any;
declare var cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'LoginPage';
  public fcmTocken:any; 
  public devicePlatform:any;
  public deviceUUID:any;
  @ViewChild(Nav) nav: Nav;
  public appPermissionReq:Array<any> = [];

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public device: Device,
              public modalCtrl: ModalController, private androidPermissions: AndroidPermissions, private diagnostic: Diagnostic) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.appPermissionReq = [];
      this.devicePlatform = this.device.platform;
      this.deviceUUID = this.device.uuid;

      // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      //   result => console.log('Has permission?',result.hasPermission),
      //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      // );
      
      this.fcmNotification();
      statusBar.styleDefault();
      splashScreen.hide();

      // this.checkPermisstions();
    });
  }

//   checkPermisstions(){
//     this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
// }

//   requestPermissions(){
//       this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_CONTACTS, 
//                                                   this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
//                                                   this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION]);
//                                                   this.appPermissionReq = [];
  
//       this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_CONTACTS).then(
//           result => (!result.hasPermission) ? this.appPermissionReq.push(this.androidPermissions.PERMISSION.READ_CONTACTS) : console.log('READ_CONTACTS?',result.hasPermission),
//           err => console.log('READ_CONTACTS?', err)
//         );
//       this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
//           result => (!result.hasPermission) ? this.appPermissionReq.push(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION) : console.log('ACCESS_COARSE_LOCATION?',result.hasPermission),
//           err => console.log('ACCESS_COARSE_LOCATION?',err)
//         );
//       this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
//           result => (!result.hasPermission) ? this.appPermissionReq.push(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION) : console.log('ACCESS_FINE_LOCATION?',result.hasPermission),
//           err => console.log('ACCESS_FINE_LOCATION?',err)
//         );

//     if(this.appPermissionReq.length > 0){
//       this.platform.exitApp();
//     }else{
//       this.fcmNotification();
//       this.statusBar.styleDefault();
//       this.splashScreen.hide();
//     }
//   }

  signupNavigate() {
    this.nav.push("RegisterPage");
  }

  signinNavigate() {
    this.nav.push("LoginPage");
  }

  forgotNavigate() {
    this.nav.push("ForgotPage");
  }

  fcmNotification() {

    FirebasePlugin.getToken((token) => {
      this.fcmTocken = token;
      console.log("Token value is", token);
    }, (error) => {
      console.log("error in token fcm processing", error);
    });

    FirebasePlugin.onNotificationOpen((notification: any) => {

        console.log("notification from firebase", notification);
        const notifyAlert = this.modalCtrl.create('NotificationAlertPage', {notification : notification});
        notifyAlert.present();

    }, (error) => {
      console.log("notification from firebase", error);
    });

    FirebasePlugin.onTokenRefresh(function (token) {
      console.log("refreshedToken value is", token);
    }, (error) => {
      console.log("error in token fcm processing", error);
    });

  }
}
