import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController  } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';

/**
 * Generated class for the PreferredOtherPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-preferred-other',
  templateUrl: 'preferred-other.html',
})
export class PreferredOtherPage {

  activities:any[];  
  requestType = "otherActivities";

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,  
    private globalVar: GlobalVarProvider, public modalCtrl: ModalController,
    private alertCtrl: AlertController, private log:LoggerProvider) {
      
  }

  ionViewDidLoad() {
    if (isNaN(this.globalVar.userID)){
      this.navCtrl.setRoot('LoginPage');
    }else{
      this.log.logActivity('other activities');
      this.getData();
    }
  }


  presentConfirm(actID:number) {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Are you sure to delete this entry?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.removeActivity(actID);
            //console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  removeActivity(actID:number){
    var myData = JSON.stringify({requestType: this.requestType, OtherActID:actID});
    this.http.post(this.globalVar.apiRemoveDataUrl, myData).subscribe( data=> {
      console.log('from php '+JSON.parse(data["_body"]));  
      let index = this.activities.findIndex(x => x.OtherActID == actID);
      this.activities.splice(index, 1);
      
    });  

  }

  getData(){
    
    var myData = JSON.stringify({requestType: this.requestType, ID:this.globalVar.userID});
   
    return this.http.post(this.globalVar.apiGetDataUrl, myData).subscribe( data=> {
     
      this.activities = JSON.parse(data["_body"]);
     // console.log(this.activities);
    });  
    
  }

  addActivity(){
    const myModal = this.modalCtrl.create('ItemCreatePage', 
    { 'type':this.requestType});
    myModal.onDidDismiss(modalData=>{
      //console.log(modalData);
      if (modalData) {
        this.activities.push(modalData);        
      }
      this.getData();
    });
    myModal.present(); 

  }
  
  openEditingModal(actID:number) {
   
    
    let index = this.activities.findIndex(x => x.OtherActID == actID);
    let content = this.activities[index];
    
    const myModal = this.modalCtrl.create('EditNoPhotoModalPage', { 'type':this.requestType,
      'details': content });
    myModal.onDidDismiss(modalData=>{  
      this.activities[index] = modalData;        
     
    });
    myModal.present(); 
  }

}
