import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController  } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';

/**
 * Generated class for the EnvironmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-environment',
  templateUrl: 'environment.html',
})
export class EnvironmentPage {

  environment:any[];  
  requestType = "environment";

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,  
    private globalVar: GlobalVarProvider, public modalCtrl: ModalController,
    private alertCtrl: AlertController, private log:LoggerProvider) {
      
  }

  ionViewDidLoad() {
    if (isNaN(this.globalVar.userID)){
      this.navCtrl.setRoot('LoginPage');
    }else{
      this.log.logActivity('environment');
      this.getData();
    }
  }


  presentConfirm(envID:number) {
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
            this.removeEnvironment(envID);
            //console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  removeEnvironment(envID:number){
    var myData = JSON.stringify({requestType: this.requestType, EnvironmentID:envID});
    this.http.post(this.globalVar.apiRemoveDataUrl, myData).subscribe( data=> {
      console.log('from php '+JSON.parse(data["_body"]));  
      let index = this.environment.findIndex(x => x.EnvironmentID == envID);
      this.environment.splice(index, 1);
      
    });  

  }

  getData(){
    
    var myData = JSON.stringify({requestType: this.requestType, ID:this.globalVar.userID});
   
    return this.http.post(this.globalVar.apiGetDataUrl, myData).subscribe( data=> {
     
      this.environment = JSON.parse(data["_body"]);
     // console.log(this.environment);
    });  
    
  }

  addEnvironment(){
    const myModal = this.modalCtrl.create('ItemCreatePage', 
    { 'type':this.requestType});
    myModal.onDidDismiss(modalData=>{
      //console.log(modalData);
      if (modalData) {
        this.environment.push(modalData);        
      }
      this.getData();
    });
    myModal.present(); 

  }
  
  openEditingModal(envID:number) {
   
    
    let index = this.environment.findIndex(x => x.EnvironmentID == envID);
    let content = this.environment[index];
    
    const myModal = this.modalCtrl.create('EditNoPhotoModalPage', { 'type':this.requestType,
      'details': content });
    myModal.onDidDismiss(modalData=>{  
      this.environment[index] = modalData;        
     
    });
    myModal.present(); 
  }


}
