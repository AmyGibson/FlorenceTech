import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';

/**
 * Generated class for the MessageBoardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message-board',
  templateUrl: 'message-board.html',
})
export class MessageBoardPage {

  messages:any[];
  requestType = "messageBoard";

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,  
    private globalVar: GlobalVarProvider, public modalCtrl: ModalController,
    private log:LoggerProvider) {
      this.messages = new Array();
  }

  ionViewDidLoad() {
    if (isNaN(this.globalVar.userID)){
      this.navCtrl.setRoot('LoginPage');
    }else{
      this.log.logActivity('message board');
      this.getData();
    }
  }

  getData(){
    
    var myData = JSON.stringify({requestType: this.requestType, ID:this.globalVar.userID});
   
    return this.http.post(this.globalVar.apiGetDataUrl, myData).subscribe( data=> {
      
      let allEntries = JSON.parse(data["_body"]);
      //console.log(allEntries);
      if (allEntries.length > 0){
        this.messages = allEntries.reverse();
      }
    });  
    
  }

  addMsg(){
    const myModal = this.modalCtrl.create('MessageModalPage', 
    { 'type':this.requestType});
    myModal.onDidDismiss(modalData=>{      
      this.getData();
      
    });
    myModal.present(); 

  }


}
