import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent, Marker, MarkerOptions, HtmlInfoWindow, LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { ToastControllerComponent } from '../../components/toast-controller/toast-controller';
import { LoadingControllerComponent } from '../../components/loading-controller/loading-controller';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the NotificationAlertPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-alert',
  templateUrl: 'notification-alert.html',
})
export class NotificationAlertPage {

  public globalData:any;
  public reqUserData:any;
  public requestLocation:any;
  public requestBody:any;
  public distanceKM:any;
  public reqNumber:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private nativeGeocoder: NativeGeocoder,
              private googleMaps: GoogleMaps, private geolocation: Geolocation, private view: ViewController,
              public loadingCtrl: LoadingControllerComponent, public commonService: CommonservicesProvider,
              private http: Http, public messageCtrl: ToastControllerComponent, public mainServices: MyApp) {

    console.log(navParams.get('notification'));
    this.globalData = navParams.get('notification');
    this.requestBody = JSON.parse(this.globalData.body);
    this.reqUserData = this.requestBody[0].userDetails;
    this.geocodeLatLng(this.requestBody[0].reqCoords[0].latitude, this.requestBody[0].reqCoords[0].longitude, "reverseGeocode");
    this.getDistanceFromLatLonInKm(this.requestBody[0].reqCoords[0].latitude, this.requestBody[0].reqCoords[0].longitude);
    this.reqNumber = this.requestBody[0].tempfreqID;
    console.log("reqUserData-->>", this.reqUserData);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationAlertPage');
  }

  geocodeLatLng(lat, lng, process) {

      if(process == "reverseGeocode"){
        this.nativeGeocoder.reverseGeocode(lat, lng)
          .then((result: NativeGeocoderReverseResult) => this.requestLocation = JSON.parse(JSON.stringify(result)) ) //console.log(JSON.stringify(result)))
          .catch((error: any) => console.log(error));
      }else{
        this.nativeGeocoder.forwardGeocode('Berlin')
          .then((coordinates: NativeGeocoderForwardResult) => console.log('The coordinates are latitude=' + coordinates.latitude + ' and longitude=' + coordinates.longitude))
          .catch((error: any) => console.log(error));
      }

      console.log(this.requestLocation);
  }

  getDistanceFromLatLonInKm(lat2,lon2) {
    // this.geolocation.getCurrentPosition().then((location) => {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-this.mainServices.currentLatitude);  // deg2rad below
    var dLon = this.deg2rad(lon2-this.mainServices.currentLongitude); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(this.mainServices.currentLatitude)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    this.distanceKM = Math.round( (R * c) * 10 ) / 10;; // Distance in km
    console.log("Distance in km==>>", this.distanceKM );
    // });
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  closeNotification(){
    this.view.dismiss();
  }

  responceToFriendReq(reqStatus){
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
    this.http.post(this.commonService.api + '/' + this.commonService.updateLatLngRequest + '/', {reqStatus : reqStatus, userLat : userLat, userLng : userLng, reqNumber : this.reqNumber}, options)
      .subscribe((res: any) => {
        console.log("res" + res);
        let success = JSON.parse(res._body);

        switch (success.status) {
          case 200:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "greenClr");
            // this.chechResponcefromOtherEnd(userMobile);
            this.view.dismiss();
            break;
          case 401:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "redClr");
            this.view.dismiss();
            break;
        }
      }
      );
    // });
  }

}
