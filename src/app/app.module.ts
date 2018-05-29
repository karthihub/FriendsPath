import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, ToastController, LoadingController, MenuController, NavController } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CommonservicesProvider } from '../providers/commonservices/commonservices';
import { ToastControllerComponent } from '../components/toast-controller/toast-controller';
import { LoadingControllerComponent } from '../components/loading-controller/loading-controller';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { Device } from '@ionic-native/device';
import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent, Marker, MarkerOptions, HtmlInfoWindow, LatLng } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { AgmCoreModule, GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral } from '@agm/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      preloadModules: true
    }),HttpClientModule, HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, 
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonservicesProvider, 
    HttpClient,ToastControllerComponent, 
    ToastController, 
    LoadingController, 
    LoadingControllerComponent,MyApp, Contacts, Device , 
    GoogleMaps, Geolocation, NativeGeocoder, AgmCoreModule,AndroidPermissions, Diagnostic, HttpClientModule
  ]
})
export class AppModule {}
