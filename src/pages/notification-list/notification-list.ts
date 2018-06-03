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
import * as moment from 'moment';
/**
 * Generated class for the NotificationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-list',
  templateUrl: 'notification-list.html',
})

export class NotificationListPage {

  public notificationList:any;

  constructor(public navparams: NavParams, public commonService: CommonservicesProvider, private formBuilder: FormBuilder,
    private http: Http, public navCtrl: NavController, public navParams: NavParams, public mainServices: MyApp,
    public messageCtrl: ToastControllerComponent, public loadingCtrl: LoadingControllerComponent,
    public contacts: Contacts, private view: ViewController, private geolocation: Geolocation) {

  }

  ionViewCanEnter(){
    this.loadingCtrl.presentLoadingWindow('Please Wait');
    let headers = new Headers(
      {
        'Content-Type': 'application/json',
      });

    let options = new RequestOptions({ headers: headers });

    //Post method to send register data
    this.http.post(this.commonService.api + '/' + this.commonService.getNotificationList + '/', {userID : localStorage.getItem('userID')}, options)
      .subscribe((res: any) => {
        console.log("res" + res);
        let success = JSON.parse(res._body);

        switch (success.status) {
          case 200:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "greenClr");
            this.notificationList = success.body;  
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

  closeNotificationListModal(){
    this.view.dismiss();
  }

  
  ionViewDidLoad() {
   
  }

  getTime(date){
    return moment(date).format('h:mm a');
  }
  getDate(date){
    return moment(date).format('DD-MM-YYYY');
  }

}
