import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CommonservicesProvider {

  api:any                 = "https://www.skeinlab.com/skeinfp";
  // api:any = "http://stracker-app-skein-tracker-application.7e14.starter-us-west-2.openshiftapps.com";
  empRegistration = "empRegistration";
  useAuthendication = "useAuthendication";
  empContactAdd = "empContactAdd";
  getContactList = "getContactList";
  newLatLngRequest = "newLatLngRequest";
  updateLatLngRequest = "updateLatLngRequest";
  putContactStar = "putContactStar";
  getFriendsPath = "getFriendsPath";
  // constructor(public http: HttpClient) {
  //   console.log('Hello CommonservicesProvider Provider');
  // }

}
