import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController  } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';

/**
 * Generated class for the GeneralRoutinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-general-routine',
  templateUrl: 'general-routine.html',
})
export class GeneralRoutinePage {

  daily:any[];
  weekly:any[];
  monthly:any[];  
  requestType = "generalRoutine";

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,  
    private globalVar: GlobalVarProvider, public modalCtrl: ModalController,
    private alertCtrl: AlertController, private log:LoggerProvider) {
      this.daily = new Array();
      this.weekly = new Array();
      this.monthly = new Array();
  }

  ionViewDidLoad() {
    if (isNaN(this.globalVar.userID)){
      this.navCtrl.setRoot('LoginPage');
    }else{
      this.log.logActivity('general routines');
      this.getData();
    }
  }


  presentConfirm(gRoutineID:number, routineType:string) {
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
            this.removeRoutine(gRoutineID, routineType);
            //console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  removeRoutine(gRoutineID:number, routineType){
    var myData = JSON.stringify({requestType: this.requestType, GRoutineID:gRoutineID});
    this.http.post(this.globalVar.apiRemoveDataUrl, myData).subscribe( data=> {
      console.log('from php '+JSON.parse(data["_body"]));  
      if (routineType == "Daily") {
        let index = this.daily.findIndex(x => x.GRoutineID == gRoutineID);
        this.daily.splice(index, 1);
      }else if (routineType == "Weekly") {
        let index = this.weekly.findIndex(x => x.GRoutineID == gRoutineID);
        this.weekly.splice(index, 1);
      }else if (routineType == "Monthly") {
        let index = this.monthly.findIndex(x => x.GRoutineID == gRoutineID);
        this.monthly.splice(index, 1);
      }
      
    });  

  }

  getData(){
    
    var myData = JSON.stringify({requestType: this.requestType, ID:this.globalVar.userID});
   
    return this.http.post(this.globalVar.apiGetDataUrl, myData).subscribe( data=> {
      
      let allEntries = JSON.parse(data["_body"]);
      this.daily = new Array();
      this.weekly = new Array();
      this.monthly = new Array();

      for (let i =  0; i < allEntries.length; i++){
        if (allEntries[i].Frequency == "Daily"){
          this.daily.push(allEntries[i]);
        }else if (allEntries[i].Frequency == "Weekly"){
          this.weekly.push(allEntries[i]);
        }else if (allEntries[i].Frequency == "Monthly"){
          this.monthly.push(allEntries[i]);
        }
      }

    });  
    
  }

  addEntry(routineType:string){
    const myModal = this.modalCtrl.create('ItemCreatePage', 
    { 'type':this.requestType, 'routineType':routineType});
    myModal.onDidDismiss(modalData=>{      
      this.getData();
    });
    myModal.present(); 

  }

  addDaily(){
    this.addEntry('Daily');

  }
  addWeekly(){
    this.addEntry('Weekly');    
  }
  addMonthly(){
    this.addEntry('Monthly');
  }

  openEditingModal(gRoutineID:number, routineType:string) {
   
    let content:any;
    let index:number;
    if (routineType == "Daily") {
      index = this.daily.findIndex(x => x.GRoutineID == gRoutineID);
      content = this.daily[index];
    }else if (routineType == "Weekly") {
      index = this.weekly.findIndex(x => x.GRoutineID == gRoutineID);
      content = this.weekly[index];
    }else if (routineType == "Monthly") {
      index = this.monthly.findIndex(x => x.GRoutineID == gRoutineID);
      content = this.monthly[index];
    } 
    
      
    const myModal = this.modalCtrl.create('EditNoPhotoModalPage', { 'type':this.requestType,
      'details': content });
    myModal.onDidDismiss(modalData=>{  
      if (routineType == "Daily") {
        this.daily[index] = modalData;
      }else if (routineType == "Weekly") {
        this.weekly[index] = modalData;
      }else if (routineType == "Monthly") {
        this.monthly[index] = modalData;
      }     
      
     
    });
    myModal.present(); 
  }

  

}
