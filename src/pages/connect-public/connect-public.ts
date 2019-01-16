import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';
/**
 * Generated class for the ConnectPublicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-connect-public',
  templateUrl: 'connect-public.html',
})
export class ConnectPublicPage {
  advertisements:any[];
  requestType = "carerAdvertisment";
  carer:any;
  existingFriends:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,  
  private globalVar: GlobalVarProvider, private log:LoggerProvider, private alertCtrl: AlertController) {
    this.advertisements = new Array();
    this.carer = navParams.get('carer');
    this.existingFriends = navParams.get('friends');

  }

  ionViewDidLoad() {
      if (isNaN(this.globalVar.userID)){
        this.navCtrl.setRoot('LoginPage');
      }else{
        this.log.logActivity('connet look for friends');
        this.getData();
      }
  }

  getData(){
    var myData = JSON.stringify({requestType: this.requestType});
     
    return this.http.post(this.globalVar.apiConnectUrl, myData).subscribe( data=> {
      
      let allEntries = JSON.parse(data["_body"]);
      //console.log(allEntries);
      if (allEntries.length > 0){
        this.advertisements = allEntries;
      }
    }); 

  }


  checkAlreadyFriend(targetID){
    for (let i = 0; i <this.existingFriends.length; i++){
      if (targetID == this.existingFriends[i]['FriendID']){
        return true;
      }
    }
    return false;
  }

  creatAlert(msg:string){
    let alert = this.alertCtrl.create({
      //title: 'Low battery',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  private sendRequest(adv){
    let requestDetails = {
      FromCarer:this.carer.CarerID, 
      ToCarer:adv.CarerID,
      AdvID:adv.AdvID
    };
    var myData = JSON.stringify({requestType: 'addFriendRequest', details:requestDetails});
    this.http.post(this.globalVar.apiConnectUrl, myData).subscribe( data=> {
      this.creatAlert('friend request sent');      
    }); 

  }



 /**
  *  1. request to self, no request 
  *  2. request to already friend, no request
  *  3. request to people who has decline before , no request but say request pending
  *  4. never has request before, yes send request
  *  5. has current pending request , no request
  *  6. has confirmed request but not current friend (one party has unfriend), can send again(?)
  */

  chooseCarer(adv){
    if(adv.CarerID == this.carer.CarerID){
      this.creatAlert('Cannot send friend request to yourself');      
    }else if (this.checkAlreadyFriend(adv.CarerID)){
      this.creatAlert('you two are already friends');    
    }else{

      let requestDetails = {
        FromCarer:this.carer.CarerID, 
        ToCarer:adv.CarerID
      };
      var myData = JSON.stringify({requestType: 'checkFriendRequest', details:requestDetails});
      this.http.post(this.globalVar.apiConnectUrl, myData).subscribe( data=> {
      
        let result = JSON.parse(data["_body"]);
        result = result['RequestStatus'];
        //console.log(result);
        if (result.length > 0){
          if (result == 'Declined' || result == 'Pending'){
            this.creatAlert('Already has a friend request pending with this user');
          }else{
            // confirmed but not current friend
            this.sendRequest(adv);
          }
        }else{
          // no request before
          this.sendRequest(adv);
        }
      });
    }

  }


}
