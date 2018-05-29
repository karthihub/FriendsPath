import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ToastControllerComponent } from '../../components/toast-controller/toast-controller';
import { LoadingControllerComponent } from '../../components/loading-controller/loading-controller';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MyApp } from '../../app/app.component';
import { Contacts, Contact, ContactField, ContactName, ContactFindOptions, ContactFieldType } from '@ionic-native/contacts';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the ContactListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {

  public contactList:any;

  constructor(public navparams: NavParams, public commonService: CommonservicesProvider, private formBuilder: FormBuilder,
              private http: Http, public navCtrl: NavController, public navParams: NavParams, public mainServices: MyApp,
              public messageCtrl: ToastControllerComponent, public loadingCtrl: LoadingControllerComponent,
              public contacts: Contacts, private view: ViewController, private geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactListPage');
  }

  ionViewCanEnter(){
    this.loadingCtrl.presentLoadingWindow('Please Wait');
    let headers = new Headers(
      {
        'Content-Type': 'application/json',
      });

    let options = new RequestOptions({ headers: headers });

    //Post method to send register data
    this.http.post(this.commonService.api + '/' + this.commonService.getContactList + '/', {userID : localStorage.getItem('userID')}, options)
      .subscribe((res: any) => {
        console.log("res" + res);
        let success = JSON.parse(res._body);

        switch (success.status) {
          case 200:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "greenClr");
            this.contactList = success.body;  
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

  requestToMeet(userMobile){
    this.loadingCtrl.presentLoadingWindow('Please Wait');
    // this.geolocation.getCurrentPosition().then((location) => {
    console.log(location);
    var userLat =  this.mainServices.currentLatitude;
    var userLng =  this.mainServices.currentLongitude;
    let headers = new Headers(
      {
        'Content-Type': 'application/json',
      });

    let options = new RequestOptions({ headers: headers });

    //Post method to send register data
    this.http.post(this.commonService.api + '/' + this.commonService.newLatLngRequest + '/', {userMobile : userMobile, lan : userLat, long : userLng}, options)
      .subscribe((res: any) => {
        let success = JSON.parse(res._body);
        console.log("success-->>", success);
        switch (success.status) {
          case 255:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "greenClr");
            // this.chechResponcefromOtherEnd(userMobile);
            this.view.dismiss(success.body);
            break;
          case 444:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "redClr");
            break;
          case 401:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "redClr");
            break;
          case 200:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "greenClr");
            break;
        }
      }
      );
    // });
  }

  chechResponcefromOtherEnd(userMobile){
    this.loadingCtrl.presentLoadingWindow('Please Wait');
    let headers = new Headers(
      {
        'Content-Type': 'application/json',
      });

    let options = new RequestOptions({ headers: headers });

    //Post method to send register data
    this.http.post(this.commonService.api + '/' + this.commonService.newLatLngRequest + '/', {userMobile : userMobile}, options)
      .subscribe((res: any) => {
        console.log("res" + res);
        let success = JSON.parse(res._body);

        switch (success.status) {
          case 200:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "greenClr");
            this.chechResponcefromOtherEnd(userMobile);
            break;
          case 401:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "redClr");

            break;
        }
      }
      );
  }

  closeContactModal(){
    this.view.dismiss();
  }

  makeStarContact(contactID){
    this.loadingCtrl.presentLoadingWindow('Please Wait');
    let headers = new Headers(
      {
        'Content-Type': 'application/json',
      });

    let options = new RequestOptions({ headers: headers });

    //Post method to send register data
    this.http.post(this.commonService.api + '/' + this.commonService.putContactStar + '/', {contactID : contactID, userID : localStorage.getItem('userID')}, options)
      .subscribe((res: any) => {
        console.log("res" + res);
        let success = JSON.parse(res._body);

        switch (success.status) {
          case 200:
            this.contactList = success.body;  
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "greenClr");
            break;
          case 401:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "redClr");

            break;
        }
      }
      );
  }
  
}
