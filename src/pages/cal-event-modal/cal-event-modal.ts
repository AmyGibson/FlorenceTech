import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { Http } from '@angular/http';
/**
 * Generated class for the CalEventModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cal-event-modal',
  templateUrl: 'cal-event-modal.html',
})
export class CalEventModalPage {

  //mydate: String = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, -1);
  event = { startTime: new Date().toISOString(), endTime: new Date().toISOString(), allDay: false, 
    title:"", eventID:0 };
  minDate = new Date().toISOString();  
  maxDate = ((new Date()).getFullYear() + 20).toString();
  isReadyToSave: boolean;
  type:string;
  ori_details:any;
  

  constructor(public navCtrl: NavController, private navParams: NavParams, 
    public viewCtrl: ViewController, private globalVar: GlobalVarProvider,
    public loadingCtrl: LoadingController, public http: Http, public zone:NgZone
   ) {

    this.type = navParams.get('type');
    if (this.type == 'add'){

      let preselectedDate = moment(this.navParams.get('selectedDay')).format();
      this.event.startTime = preselectedDate;
      this.event.endTime = preselectedDate;
    }else if (this.type == 'edit'){
      this.event = navParams.get('details');
      this.event.startTime = moment(this.event.startTime).format();
      this.event.endTime = moment(this.event.endTime).format();
      //this.ori_details = JSON.parse(JSON.stringify(this.event));
      this.ori_details = this.event;
    }

    
  }
 

  
  cancel(){
   
    this.zone.run(() =>{
      //this.event = JSON.parse(JSON.stringify(this.ori_details));
      this.event = this.ori_details;
    });
    this.dismiss();
  }

  dismiss() {
    //console.log("profile " + this.details.ProfilePic);
    this.viewCtrl.dismiss(this.event);
  }
 
  validate(){
    if (this.event.title != ""){
      this.isReadyToSave = true;
    }else{
      this.isReadyToSave = false;
    }
  }



  addItem() {
    
    let addContent ={
      'ID':this.globalVar.userID,
      'Title': this.event.title,
      'StartTime': this.event.startTime.slice(0, 19).replace('T', ' '),
      'EndTime': this.event.endTime.slice(0, 19).replace('T', ' '),
      'AllDay': false
    }; 
    
    
    let myData = JSON.stringify({requestType: 'calEvent', details:addContent});
    //console.log(addContent);
    //console.log(myData);
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Adding entry',
    });

    loading.present();
    

    this.http.post(this.globalVar.apiAddDataUrl, myData).subscribe( data=> {  
      loading.dismiss(); 
      
      this.viewCtrl.dismiss(this.event);
      console.log('from php '+JSON.parse(data["_body"]));
      
    }, err =>{
      console.log(err);  
    });
      
  }





  update() {
    
    let content ={
      'ID':this.globalVar.userID,
      'Title': this.event.title,
      'StartTime': this.event.startTime.slice(0, 19).replace('T', ' '),
      'EndTime': this.event.endTime.slice(0, 19).replace('T', ' '),
      'AllDay': false,
      'EventID': this.event.eventID
    }; 
    var myData = JSON.stringify({requestType: 'calEvent', details: content});
    
    
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'updating changes',
    });

    loading.present();
    

    this.http.post(this.globalVar.apiUpdateDataUrl, myData).subscribe( data=> {  
      loading.dismiss();
         
      //this.ori_details = JSON.parse(JSON.stringify(this.event));

      this.dismiss(); 
      console.log('from php '+JSON.parse(data["_body"]));
    }, err =>{
      console.log(err);  
    });   
  }



}
