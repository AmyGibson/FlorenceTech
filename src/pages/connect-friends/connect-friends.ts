import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';
/**
 * Generated class for the ConnectFriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-connect-friends',
  templateUrl: 'connect-friends.html',
})
export class ConnectFriendsPage {

  friends:any[];
  requestType = "friendList";
  carer:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,  
    private globalVar: GlobalVarProvider, private log:LoggerProvider, public modalCtrl: ModalController) {
      this.carer = navParams.get('carer');
      this.friends = new Array();
      //console.log(this.carer.CarerID);
  }

  ionViewDidLoad() {
    if (isNaN(this.globalVar.userID)){
      this.navCtrl.setRoot('LoginPage');
    }else{
      this.log.logActivity('connet friend list with carerID '+ this.carer.CarerID);
      this.getData();
    }
  }

  getData(){

  }

  advertise(){
    let carer = {
      CarerID: this.carer.CarerID,
      Name:this.carer.Name
    };
    const myModal = this.modalCtrl.create('ConnectModalPage',     
    { type:'advertiseCarer', carer:carer});
    myModal.onDidDismiss(modalData=>{      
      //this.getData();
      
    });
    myModal.present(); 

  }

  browseCarers(){
    
    this.navCtrl.push('ConnectPublicPage', {carer:this.carer, friends:this.friends});
    
  }

}
