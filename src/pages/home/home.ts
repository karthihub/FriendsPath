import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, MenuController } from 'ionic-angular';
import { ToastControllerComponent } from '../../components/toast-controller/toast-controller';
import { LoadingControllerComponent } from '../../components/loading-controller/loading-controller';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent, Marker, MarkerOptions, HtmlInfoWindow, LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyApp } from '../../app/app.component';
declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  public userName: any;
  public currentLocationLatLng: any;
  public friendsReqLatLng: any;
  title: string = 'My first AGM project';
  lat: number;
  lng: number;
  markers: Array<any> = [];
  zoom: number = 15;


  @ViewChild('map') mapElement: ElementRef;
  map: any;
  public markerList: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public messageCtrl: ToastControllerComponent,
    public loadingCtrl: LoadingControllerComponent, public modalCtrl: ModalController,
    private platform: Platform, private geolocation: Geolocation,
    public commonService: CommonservicesProvider, private http: Http, public menuCtrl: MenuController,
    public mainServices: MyApp) {

    this.userName = localStorage.getItem('userName');
    this.markerList = [];
    this.menuCtrl.swipeEnable(false);

    if (this.navParams.get('fGroupMenbers') != undefined) {
      this.loadGroupFriendLocation(this.navParams.get('fGroupMenbers'));
    } else if (this.navParams.get('location') != undefined) {
      var data = this.navParams.get('location');
      this.addNewMarker(data[0].userLat, data[0].userLng, data[0].userName);
    } else if (this.navParams.get('friendsLastPath') != undefined) {
      this.friendsLastPath();
    } else if (this.navParams.get('logoutUser') != undefined) {
      this.logoutUser();
    } 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.loadMap();
  }

  loadMap() {
    this.loadingCtrl.presentLoadingWindow('');
    var geocoder = new google.maps.Geocoder;
    this.markerList = [];
    var infowindow;
    // this.geolocation.getCurrentPosition().then((location) => {
    let latLng = new google.maps.LatLng(this.mainServices.currentLatitude, this.mainServices.currentLongitude);

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
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: './assets/imgs/current.svg'
    });



    geocoder.geocode({ 'location': latLng }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0]);
          var contentString = '<div class="infowindow">' +
          '<span><b>' + localStorage.getItem('userName') + '</b></span><br>' +
            '<span>' + results[0].formatted_address + '</span>' +
            '</div>';
          infowindow = new google.maps.InfoWindow({
            content: contentString
          });
        } else {
          infowindow = new google.maps.InfoWindow({
            content: "Location not found :("
          });
        }
      }

    });

    marker.addListener('click', function () {
      infowindow.open(this.map, marker);
    });

    this.markerList.push(latLng);

    var cityCircle = new google.maps.Circle({
      strokeColor: '#441F76',
      strokeOpacity: 0.4,
      strokeWeight: 1,
      fillColor: '#441F76',
      fillOpacity: 0.15,
      map: this.map,
      center: latLng,
      radius: 500
    });



    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
      this.loadingCtrl.dismissLoadingWindow();
    }, 1000);

    // })
  }

  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";

    this.addInfoWindow(marker, content);

  }

  addInfoWindow(marker, content) {

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

      if (data) {
        this.loadMap();
        this.addNewMarker(data[0].userLat, data[0].userLng, data[0].userName);
        console.log(data);
      }
    });
    contactListModal.present();
  }

  markerIconUrl() {
    return "./assets/imgs/marker.png";
  }

  mapCenterPosition() {

    if (this.markerList.length == 1) {
      this.map.panTo(this.markerList[0]);
    } else {
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < this.markerList.length; i++) {
        bounds.extend(this.markerList[i]);
      }
      this.map.fitBounds(bounds);
    }

  }


  requestToMeet() {
    this.loadingCtrl.presentLoadingWindow('Please Wait');
    // this.geolocation.getCurrentPosition().then((location) => {
    console.log(location);
    var userLat = this.mainServices.currentLatitude;
    var userLng = this.mainServices.currentLongitude;
    let headers = new Headers(
      {
        'Content-Type': 'application/json',
      });

    let options = new RequestOptions({ headers: headers });

    //Post method to send register data
    this.http.post(this.commonService.api + '/' + this.commonService.newLatLngRequest + '/', { userID: localStorage.getItem('userID'), userName: localStorage.getItem('userName'), lan: userLat, long: userLng }, options)
      .subscribe((res: any) => {
        let success = JSON.parse(res._body);
        console.log("success-->>", success);
        switch (success.status) {
          case 255:
            this.messageCtrl.presentToast(success.message, "greenClr");
            console.log(success.body[0].userLat);
            this.loadingCtrl.dismissLoadingWindow();
            this.loadMap();
            this.addNewMarker(success.body[0].userLat, success.body[0].userLng, success.body[0].userName);
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

  addNewMarker(latitude, longitude, userName) {
    console.log(latitude, longitude);
    var geocoder = new google.maps.Geocoder;

    let marker = new google.maps.Marker({
      map: this.map,
      draggable: false,
      animation: google.maps.Animation.BOUNCE,
      position: new google.maps.LatLng(latitude, longitude),
      icon: './assets/imgs/friends.svg'
    });
    let infoWindowi: any;
    geocoder.geocode({ 'location': new google.maps.LatLng(latitude, longitude) }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0]);
          var contentString = '<div class="infowindow">' +
          '<span><b>' + userName + '</b></span><br>' +
            '<span>' + results[0].formatted_address + '</span>' +
            '</div>';
          infoWindowi = new google.maps.InfoWindow({
            content: contentString
          });
        } else {
          infoWindowi = new google.maps.InfoWindow({
            content: "Location not found :("
          });
        }
      }

    });

    marker.addListener('click', function () {
      infoWindowi.open(this.map, marker);
    });


    var cityCircle = new google.maps.Circle({
      strokeColor: '#FF4847',
      strokeOpacity: 0.4,
      strokeWeight: 1,
      fillColor: '#FF4847',
      fillOpacity: 0.15,
      map: this.map,
      center: new google.maps.LatLng(latitude, longitude),
      radius: 500
    });

    this.markerList.push(new google.maps.LatLng(latitude, longitude));
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < this.markerList.length; i++) {
      bounds.extend(this.markerList[i]);
    }
    this.map.fitBounds(bounds);
    this.loadingCtrl.dismissLoadingWindow();
  }


  friendsLastPath() {

    this.loadingCtrl.presentLoadingWindow('Please Wait');

    let headers = new Headers(
      {
        'Content-Type': 'application/json',
      });

    let options = new RequestOptions({ headers: headers });

    //Post method to send register data
    this.http.post(this.commonService.api + '/' + this.commonService.getFriendsPath + '/', { userID: localStorage.getItem('userID') }, options)
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
            this.loadMap();
            for (var i = 0; i < success.body.length; i++) {
              this.addNewMarker(success.body[i].userLat, success.body[i].userLng, success.body[i].userName);
            }
            break;
        }
      }
      );
    this.loadingCtrl.dismissLoadingWindow();
  }

  clearMarkers() {
    this.loadMap();
  }

  loadGroupFriendLocation(fGroupMenbers) {

    this.loadingCtrl.presentLoadingWindow('Please Wait');

    let headers = new Headers(
      {
        'Content-Type': 'application/json',
      });

    let options = new RequestOptions({ headers: headers });

    //Post method to send register data
    this.http.post(this.commonService.api + '/' + this.commonService.getFriendsGroupLocations + '/', { fGroupMenbers: fGroupMenbers }, options)
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
            //this.loadMap();
            for (var i = 0; i < success.body.length; i++) {
              this.addNewMarker(success.body[i].userLat, success.body[i].userLng, success.body[i].userName);
            }
            break;
        }
      }
      );

    this.loadingCtrl.dismissLoadingWindow();
  }

  logoutUser() {
    this.loadingCtrl.presentLoadingWindow('Please Wait');
    let headers = new Headers({ 'Content-Type': 'application/json', });
    let options = new RequestOptions({ headers: headers });
    this.http.post(this.commonService.api + '/' + this.commonService.userLogout + '/', { userDeviceTocken: this.mainServices.deviceUUID }, options)
      .subscribe((res: any) => {
        let success = JSON.parse(res._body);
        console.log("success-->>", success);
        switch (success.status) {
          case 401:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "greenClr");
            break;
          case 200:
            setTimeout(() => {
              this.loadingCtrl.dismissLoadingWindow();
              localStorage.clear();
              this.navCtrl.setRoot('LoginPage');
            }, 1000);
            break;
        }
      }
      );
      this.loadingCtrl.dismissLoadingWindow();
  }



}
