import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';

/**
 * Generated class for the ConnectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-connect',
  templateUrl: 'connect.html',
})
export class ConnectPage {
  carers:any[];
  requestType = "carerList";

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,  
    private globalVar: GlobalVarProvider, public modalCtrl: ModalController,
    private log:LoggerProvider) {
      this.carers = new Array();
    }
  
    ionViewDidLoad() {
      if (isNaN(this.globalVar.userID)){
        this.navCtrl.setRoot('LoginPage');
      }else{
        this.log.logActivity('connet front page');
        this.getData();
      }
    }
  
    getData(){
      
      var myData = JSON.stringify({requestType: this.requestType, ID:this.globalVar.userID});
     
      return this.http.post(this.globalVar.apiGetDataUrl, myData).subscribe( data=> {
        
        let allEntries = JSON.parse(data["_body"]);
        //console.log(allEntries);
        if (allEntries.length > 0){
          this.carers = allEntries;
        }
      });  
      
    }
  
    addCarer(){
      const myModal = this.modalCtrl.create('ConnectModalPage', 
      { 'type':'addCarer'});
      myModal.onDidDismiss(modalData=>{      
        this.getData();
        
      });
      myModal.present(); 
  
    }

    chooseCarer(carer:any){
      // get the carer /name
      // pass that to the friend list page
      
      this.navCtrl.push('ConnectFriendsPage', {carer:carer});
      
    }
    

}
