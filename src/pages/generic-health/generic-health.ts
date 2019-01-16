import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController  } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';
/**
 * Generated class for the GenericHealthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-generic-health',
  templateUrl: 'generic-health.html',
})
export class GenericHealthPage {

  entries:any[];  
  requestType = '';
  title = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,  
    private globalVar: GlobalVarProvider, public modalCtrl: ModalController,
    private alertCtrl: AlertController, private log:LoggerProvider) {
      this.requestType = navParams.get('type');
      if (this.requestType == 'medConditions'){
        this.title = "Medical condition/allergies"; 
      }else if (this.requestType == 'specialists'){
        this.title = "Specialists"; 
      }
  }

  ionViewDidLoad() {
    if (isNaN(this.globalVar.userID)){
      this.navCtrl.setRoot('LoginPage');
    }else{
      this.log.logActivity('general health');
      this.getData();
    }
  }


  presentConfirm(entryID:number) {
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
            this.removeEnvironment(entryID);
            //console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  removeEnvironment(entryID:number){
    var myData = JSON.stringify({requestType: this.requestType, EntryID:entryID});
    this.http.post(this.globalVar.apiRemoveDataUrl, myData).subscribe( data=> {
      console.log('from php '+JSON.parse(data["_body"]));  
      let index = this.entries.findIndex(x => x.EntryID == entryID);
      this.entries.splice(index, 1);
      
    });  

  }

  getData(){
    
    var myData = JSON.stringify({requestType: this.requestType, ID:this.globalVar.userID});
   
    return this.http.post(this.globalVar.apiGetDataUrl, myData).subscribe( data=> {
     
      this.entries = JSON.parse(data["_body"]);
      console.log(this.entries);
    });  
    
  }

  addEntry(){
    const myModal = this.modalCtrl.create('ItemCreatePage', 
    { 'type':this.requestType});
    myModal.onDidDismiss(modalData=>{
      //console.log(modalData);
      if (modalData) {
        this.entries.push(modalData);                
      }
      this.getData();
    });
    myModal.present(); 

  }
  
  openEditingModal(entryID:number) {
   
    console.log(entryID);
    
    let index = this.entries.findIndex(x => x.EntryID == entryID);
    let content = this.entries[index];
    
    const myModal = this.modalCtrl.create('EditNoPhotoModalPage', { 'type':this.requestType,
      'details': content });
    myModal.onDidDismiss(modalData=>{  
      this.entries[index] = modalData;        
     
    });
    myModal.present(); 
  }

}
