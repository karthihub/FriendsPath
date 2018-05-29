import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ToastControllerComponent } from '../../components/toast-controller/toast-controller';
import { LoadingControllerComponent } from '../../components/loading-controller/loading-controller';
import { CommonservicesProvider } from '../../providers/commonservices/commonservices';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MyApp } from '../../app/app.component';
import { Contacts, Contact, ContactField, ContactName, ContactFindOptions, ContactFieldType } from '@ionic-native/contacts';

/**
 * Generated class for the AddNewGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-new-group',
  templateUrl: 'add-new-group.html',
})
export class AddNewGroupPage {

  // cucumber: boolean;
  public contactList: any;
  public groupMemList: Array<any> = [];
  public groupName: any;

  constructor(public navparams: NavParams, public commonService: CommonservicesProvider, private formBuilder: FormBuilder,
    private http: Http, public navCtrl: NavController, public navParams: NavParams, public mainServices: MyApp,
    public messageCtrl: ToastControllerComponent, public loadingCtrl: LoadingControllerComponent,
    public contacts: Contacts, private view: ViewController) {
    this.groupMemList = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewGroupPage');
  }

  pickContactsFromPhone(): void {
    this.contacts.pickContact()
      .then((response: any) => {
        console.log('The following contact has been selected:' + JSON.stringify(response));
        //  this.addContactData.controls['contactName'].setValue(response._objectInstance.displayName);

        //  this.addContactData.controls['mobileNo'].setValue(response._objectInstance.phoneNumbers[0].value);

      });

    //    setTimeout(()=>{    

    // },1000);
  }

  closeAddNewGroupModal() {
    this.view.dismiss();
  }

  ionViewCanEnter() {
    this.loadingCtrl.presentLoadingWindow('Please Wait');
    let headers = new Headers(
      {
        'Content-Type': 'application/json',
      });

    let options = new RequestOptions({ headers: headers });

    //Post method to send register data
    this.http.post(this.commonService.api + '/' + this.commonService.getContactList + '/', { userID: localStorage.getItem('userID') }, options)
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

  addMember(contact) {
    var state = '';
    if (this.groupMemList.length < 10) {
      if (this.groupMemList.length == 0) {
        this.groupMemList.push(contact);
      } else {
        for (var i = 0; i < this.groupMemList.length; i++) {
          if (this.groupMemList[i].contactRegID == contact.contactRegID) {
            status = 'Exist';
            break;
          } else {
            status = '';
          }
        }
        if (status == 'Exist') {
          this.messageCtrl.presentToast(contact.contactName + " already added..", "redClr");
        } else {
          this.groupMemList.push(contact);
        }
      }
    } else {
      this.messageCtrl.presentToast("Maximum Members added..", "redClr");
    }


  }

  removeMember(contact) {
    const index: number = this.groupMemList.indexOf(contact);
    if (index !== -1) {
      this.groupMemList.splice(index, 1);
      this.messageCtrl.presentToast(contact.contactName + " has removed..", "redClr");
    }
  }

  addNewGroup() {
    if (this.groupName == undefined || this.groupName.length < 4) {
      this.messageCtrl.presentToast("Group Name should be minimun 4 Char..", "redClr");
    } else if (this.groupMemList.length < 2) {
      this.messageCtrl.presentToast("Group should have minimum 2 Members..", "redClr");
    } else {

      this.loadingCtrl.presentLoadingWindow('Please Wait');
      var addNewGroup = {
        createdUserID: localStorage.getItem('userID'),
        fGroupMenbers: this.groupMemList,
        groupName: this.groupName
      }
      let headers = new Headers(
        {
          'Content-Type': 'application/json',
        });

      let options = new RequestOptions({ headers: headers });

      //Post method to send register data
      this.http.post(this.commonService.api + '/' + this.commonService.addNewUserGroup + '/', addNewGroup, options)
        .subscribe((res: any) => {
          console.log("res" + res);
          let success = JSON.parse(res._body);

          switch (success.status) {
            case 200:
              this.loadingCtrl.dismissLoadingWindow();
              this.messageCtrl.presentToast(success.message, "greenClr");
              // this.navCtrl.push("HomePage");
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


  }

}
