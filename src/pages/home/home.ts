import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { ToastControllerComponent } from '../../components/toast-controller/toast-controller';
import { LoadingControllerComponent } from '../../components/loading-controller/loading-controller';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent, Marker, MarkerOptions, HtmlInfoWindow, LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { Http, Headers, RequestOptions } from '@angular/http';

declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  public userName:any;
  public currentLocationLatLng:any;
  public friendsReqLatLng:any;
  title: string = 'My first AGM project';
  lat: number ;
  lng: number ;
  markers: Array<any> = [];
  zoom: number = 13;

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  public markerList:Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public messageCtrl: ToastControllerComponent, 
              public loadingCtrl: LoadingControllerComponent, public modalCtrl: ModalController,
               private platform: Platform, private geolocation: Geolocation,
              public commonService: CommonservicesProvider, private http: Http) {

      this.userName = localStorage.getItem('userName');
      this.markerList = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.loadMap();
  }

  loadMap(){
    this.loadingCtrl.presentLoadingWindow('');
    this.markerList = [];
    this.geolocation.getCurrentPosition().then((location) => {
        let latLng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
    
        let mapOptions = {
          center: latLng,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          panControl: false,
          zoomControl: false,
          mapTypeControl: true,
          scaleControl: false,
          streetViewControl: false,
          overviewMapControl: false,
          rotateControl: false 
        }
    
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        let marker = new google.maps.Marker({
          map: this.map,
          draggable: false,
          animation: google.maps.Animation.BOUNCE,
          position: {lat: location.coords.latitude, lng: location.coords.longitude}
        });

        this.markerList.push(new google.maps.LatLng(location.coords.latitude ,location.coords.longitude));

        var cityCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: this.map,
          center: new google.maps.LatLng(location.coords.latitude ,location.coords.longitude),
          radius: 500
        });

        this.loadingCtrl.dismissLoadingWindow();

    })
  }

  addMarker(){
 
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
   
    let content = "<h4>Information!</h4>";         
   
    this.addInfoWindow(marker, content);
   
  }

  addInfoWindow(marker, content){
 
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
   
  }

  

  addContactModal() {
    const contactModal = this.modalCtrl.create('ContactModalPage');
    contactModal.onDidDismiss(data => {
      console.log(data);
    });
    contactModal.present();
  }

  viewContactListModal() {
    const contactListModal = this.modalCtrl.create('ContactListPage');
    contactListModal.onDidDismiss(data => {

      if(data){
        this.addNewMarker(data[0].userLat, data[0].userLng);
        console.log(data);
        }
    });
    contactListModal.present();
  }

  markerIconUrl(){
    return "./assets/imgs/marker.png";
  }

  mapCenterPosition(){

    if(this.markerList.length == 1){
      this.map.panTo(this.markerList[0]);
    }else{
      var bounds = new google.maps.LatLngBounds();
      for(var i=0; i<this.markerList.length; i++)
      {
        bounds.extend(this.markerList[i]);
      }
      this.map.fitBounds(bounds);
    }

  }


  requestToMeet(){
    this.loadingCtrl.presentLoadingWindow('Please Wait');
    this.geolocation.getCurrentPosition().then((location) => {
    console.log(location);
    var userLat =  location.coords.latitude;
    var userLng =  location.coords.longitude;
    let headers = new Headers(
      {
        'Content-Type': 'application/json',
      });

    let options = new RequestOptions({ headers: headers });

    //Post method to send register data
    this.http.post(this.commonService.api + '/' + this.commonService.newLatLngRequest + '/', {userID : localStorage.getItem('userID'), lan : userLat, long : userLng}, options)
      .subscribe((res: any) => {
        let success = JSON.parse(res._body);
        console.log("success-->>", success);
        switch (success.status) {
          case 255:
            this.messageCtrl.presentToast(success.message, "greenClr");
            console.log(success.body[0].userLat);
            this.addNewMarker(success.body[0].userLat, success.body[0].userLng);
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
    });
  }

  addNewMarker(latitude, longitude){
    console.log(latitude, longitude);
    let marker = new google.maps.Marker({
      map: this.map,
      draggable: false,
      animation: google.maps.Animation.BOUNCE,
      position: new google.maps.LatLng(latitude ,longitude)
    });

    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      center: new google.maps.LatLng(latitude ,longitude),
      radius: 500
    });

    this.markerList.push(new google.maps.LatLng(latitude ,longitude));
    var bounds = new google.maps.LatLngBounds();
    for(var i=0; i<this.markerList.length; i++)
    {
      bounds.extend(this.markerList[i]);
    }
    this.map.fitBounds(bounds);
    this.loadingCtrl.dismissLoadingWindow();
  }


  friendsLastPath(){

    this.loadingCtrl.presentLoadingWindow('Please Wait');

    let headers = new Headers(
      {
        'Content-Type': 'application/json',
      });

    let options = new RequestOptions({ headers: headers });

    //Post method to send register data
    this.http.post(this.commonService.api + '/' + this.commonService.getFriendsPath + '/', {userID : localStorage.getItem('userID')}, options)
      .subscribe((res: any) => {
        let success = JSON.parse(res._body);
        console.log("success-->>", success);
        switch (success.status) {
          case 401:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "redClr");
            break;
          case 200:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "greenClr");
            for(var i=0; i<success.body.length; i++){
              this.addNewMarker(success.body[i].userLat, success.body[i].userLng);
            }
            break;
        }
      }
      );

  }

  clearMarkers(){
    this.loadMap();
  }

  

}
