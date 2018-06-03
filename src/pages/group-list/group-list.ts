import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { ToastControllerComponent } from '../../components/toast-controller/toast-controller';
import { LoadingControllerComponent } from '../../components/loading-controller/loading-controller';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MyApp } from '../../app/app.component';
import { Contacts, Contact, ContactField, ContactName, ContactFindOptions, ContactFieldType } from '@ionic-native/contacts';
import { Geolocation } from '@ionic-native/geolocation';
/**
 * Generated class for the GroupListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-list',
  templateUrl: 'group-list.html',
})
export class GroupListPage {

  public groupList:Array<any> = [];

  constructor(public navparams: NavParams, public commonService: CommonservicesProvider, private formBuilder: FormBuilder,
    private http: Http, public navCtrl: NavController, public navParams: NavParams, public mainServices: MyApp,
    public messageCtrl: ToastControllerComponent, public loadingCtrl: LoadingControllerComponent,
    public contacts: Contacts, private view: ViewController, private geolocation: Geolocation, public modalCtrl: ModalController,) {

      this.groupList = [];
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
  this.http.post(this.commonService.api + '/' + this.commonService.getUserGroupList + '/', {createdUserID : localStorage.getItem('userID')}, options)
    .subscribe((res: any) => {
      console.log("res" + res);
      let success = JSON.parse(res._body);

      switch (success.status) {
        case 200:
          this.loadingCtrl.dismissLoadingWindow();
          this.messageCtrl.presentToast(success.message, "greenClr");
          this.groupList = success.body;  

          for(var i=0; i<this.groupList.length; i++){
            console.log(JSON.stringify(this.groupList[i].fGroupMenbers));
            let tempVar = this.groupList[i].fGroupMenbers;
            this.groupList[i].fGroupMenbers = tempVar.replace(/\\/g, "black")
            this.groupList[i].fGroupMenbers = JSON.parse(this.groupList[i].fGroupMenbers);
          }
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

closeGroupListModal(){
  this.view.dismiss();
}

userGroupDelete(fGroupID){
  this.loadingCtrl.presentLoadingWindow('Please Wait');
  let headers = new Headers(
    {
      'Content-Type': 'application/json',
    });

  let options = new RequestOptions({ headers: headers });

  //Post method to send register data
  this.http.post(this.commonService.api + '/' + this.commonService.deleteUserGroup + '/', {fGroupID : fGroupID}, options)
    .subscribe((res: any) => {
      console.log("res" + res);
      let success = JSON.parse(res._body);

      switch (success.status) {
        case 200:
          this.loadingCtrl.dismissLoadingWindow();
          this.messageCtrl.presentToast(success.message, "greenClr");
          this.ionViewCanEnter();
          break;
        case 401:
          this.loadingCtrl.dismissLoadingWindow();
          this.messageCtrl.presentToast(success.message, "redClr");
          break;
      }
    }
    );
}

editUserGroup(group){
  this.loadingCtrl.presentLoadingWindow('Please Wait');

  const editUserGroupModal = this.modalCtrl.create('AddNewGroupPage', {group : group, edit : true});
  editUserGroupModal.onDidDismiss(data => {
      console.log(data);
    });
    editUserGroupModal.present();

    this.loadingCtrl.dismissLoadingWindow();
}

groupLocaationData(fGroupMenbers){
  this.view.dismiss(fGroupMenbers);
}

}
