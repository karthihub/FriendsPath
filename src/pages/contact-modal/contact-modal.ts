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
 * Generated class for the ContactModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-modal',
  templateUrl: 'contact-modal.html',
})
export class ContactModalPage {

  public addContactData: FormGroup;
  public userID:any;

  constructor(public navparams: NavParams, public commonService: CommonservicesProvider, private formBuilder: FormBuilder,
              private http: Http, public navCtrl: NavController, public navParams: NavParams, public mainServices: MyApp,
              public messageCtrl: ToastControllerComponent, public loadingCtrl: LoadingControllerComponent,
              public contacts: Contacts, private view:ViewController) {

                this.userID = localStorage.getItem('userID');
                this.addContactData = this.formBuilder.group({

                  contactName: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(15), Validators.required])],
                  mobileNo   : ['', Validators.compose([Validators.pattern('^[0-9+]{13,15}$'), Validators.minLength(13), Validators.maxLength(15), Validators.required])]
                });
  }

  pickContactsFromPhone() :void {
     this.contacts.pickContact()
                .then((response: any) => { 
                   console.log('The following contact has been selected:' + JSON.stringify(response));
                  this.addContactData.controls['contactName'].setValue(response._objectInstance.displayName);
                  
                  this.addContactData.controls['mobileNo'].setValue(response._objectInstance.phoneNumbers[0].value);
                 
                });

                setTimeout(()=>{    
                  this.addContactData.controls['mobileNo'].markAsDirty();
                  this.addContactData.controls['mobileNo'].markAsTouched();
                  this.addContactData.controls['mobileNo'].updateValueAndValidity();
             },1000);
  }

  addNewContact(){
    this.loadingCtrl.presentLoadingWindow('Please Wait');
    this.addContactData.value.userID = this.userID;
    let headers = new Headers(
      {
        'Content-Type': 'application/json',
      });

    let options = new RequestOptions({ headers: headers });

    //Post method to send register data
    this.http.post(this.commonService.api + '/' + this.commonService.empContactAdd + '/', this.addContactData.value, options)
      .subscribe((res: any) => {
        console.log("res" + res);
        let success = JSON.parse(res._body);

        switch (success.status) {
          case 200:
            this.loadingCtrl.dismissLoadingWindow();
            this.messageCtrl.presentToast(success.message, "greenClr");
            this.view.dismiss();
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactModalPage');
  }

  closeContactModal(){
    this.view.dismiss();
  }

}
