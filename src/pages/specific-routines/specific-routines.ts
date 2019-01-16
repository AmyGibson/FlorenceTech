import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { Http } from '@angular/http';
import { ViewChild } from '@angular/core';
import { CalendarComponent } from "ionic2-calendar/calendar";
import { LoggerProvider } from '../../providers/logger/logger';
/**
 * Generated class for the SpecificRoutinesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-specific-routines',
  templateUrl: 'specific-routines.html',
})
export class SpecificRoutinesPage {
  @ViewChild(CalendarComponent) myCalendar:CalendarComponent;
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  requestType = "calEvent";
 
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  
  constructor(public navCtrl: NavController, private modalCtrl: ModalController, 
    private alertCtrl: AlertController, private globalVar: GlobalVarProvider,
    public http: Http, private log:LoggerProvider) { }
 

  ionViewDidLoad(){
    //console.log('uid ' + this.globalVar.userID);
    if (isNaN(this.globalVar.userID)){
      this.navCtrl.setRoot('LoginPage');
    }else{
      this.log.logActivity('appointments');
      this.getData();
    }
  }

  addEvent() {
    
    let modal = this.modalCtrl.create('CalEventModalPage', {selectedDay: this.selectedDay, type:'add'});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;
 
        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);
 
        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });
  }
 
  
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
 
  onEventSelected(event) {
    console.log('onEventSelected');
    /*
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');
    
    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();*/
  }
 
  onTimeSelected(ev) {
    console.log('onTimeSelected');
    this.selectedDay = ev.selectedTime;
  }

  nextMonth(){
    this.calendar.currentDate = moment(this.calendar.currentDate).add(1, 'months').toDate();
  }

  previousMonth(){
    this.calendar.currentDate = moment(this.calendar.currentDate).subtract(1, 'months').toDate();
  }

  getData(){
    
    var myData = JSON.stringify({requestType: this.requestType, ID:this.globalVar.userID});
   
    return this.http.post(this.globalVar.apiGetDataUrl, myData).subscribe( data=> {
     
      if (data) {
        let details = JSON.parse(data["_body"]);
        
        for (let i = 0; i < details.length; i++){
         
          let eventData = {
            'startTime': new Date(details[i].StartTime),
            'endTime': new Date(details[i].EndTime),
            //'startTime': details[i].StartTime,
            //'endTime': details[i].EndTime,
            'title': details[i].Title,
            'allDay': false,
            'eventID': details[i].EventID
          }
          
          let events = this.eventSource;
          events.push(eventData);
          this.eventSource = [];
         // setTimeout(() => {
            this.eventSource = events;           
           
          //});
          this.myCalendar.loadEvents();
        }
        
        
      }
      
    });  
    
  }


  
  removeEvent(eventID:number){
    //console.log(eventID);
    
    var myData = JSON.stringify({requestType: this.requestType, EventID:eventID});
    this.http.post(this.globalVar.apiRemoveDataUrl, myData).subscribe( data=> {
      console.log('from php '+JSON.parse(data["_body"]));  
      let index = this.eventSource.findIndex(x => x.eventID == eventID);
      this.eventSource.splice(index, 1);
      this.myCalendar.loadEvents();
    });  
    
  }
  
  

  editEvent(eventID:number) {
    console.log(eventID);
    
    let index = this.eventSource.findIndex(x => x.eventID == eventID);
    let content = this.eventSource[index];
    //console.log(content);
    const myModal = this.modalCtrl.create('CalEventModalPage', { type:'edit',
      'details': content });
    myModal.onDidDismiss(modalData=>{  
     // console.log( modalData);

      let eventData = modalData;
 
        eventData.startTime = new Date(modalData.startTime);
        eventData.endTime = new Date(modalData.endTime);
 
        let events = this.eventSource;
        events[index] = eventData;  
        //events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });


      //this.eventSource[index] = modalData;        
      //this.myCalendar.loadEvents();
    });
    myModal.present(); 
  }

}
