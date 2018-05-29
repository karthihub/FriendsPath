import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CommonservicesProvider {

  // api:any                 = "https://www.skeinlab.com/skeinfp";
  api:any = "http://192.168.1.8:6004";
  empRegistration = "empRegistration";
  useAuthendication = "useAuthendication";
  empContactAdd = "empContactAdd";
  getContactList = "getContactList";
  newLatLngRequest = "newLatLngRequest";
  updateLatLngRequest = "updateLatLngRequest";
  putContactStar = "putContactStar";
  getFriendsPath = "getFriendsPath";
  addNewUserGroup = "addNewUserGroup";
  getUserGroupList = "getUserGroupList";
  updateUserGroup = "updateUserGroup";
  deleteUserGroup = "deleteUserGroup";
  // constructor(public http: HttpClient) {
  //   console.log('Hello CommonservicesProvider Provider');
  // }

}
