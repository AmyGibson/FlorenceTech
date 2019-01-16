import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';

/**
 * Generated class for the MessageModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message-modal',
  templateUrl: 'message-modal.html',
})
export class MessageModalPage {

  type: string;
  userID:number;
  message:string;
  fromWhom:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public http: Http,  
    private globalVar: GlobalVarProvider, public loadingCtrl: LoadingController) {

      this.type = navParams.get('type');    
      this.userID = this.globalVar.userID;
  }

  ionViewDidLoad() {
    
  }

  cancel(){
   
    this.viewCtrl.dismiss(null);
  }

  
  postMsg() {
    let addContent:any;
    
    addContent ={
      'ID':this.userID,
      'Message': this.message,
      'FromWhom': this.fromWhom
    };
    
    var myData = JSON.stringify({requestType: this.type, details:addContent});

    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'posting message',
    });

    loading.present();
    

    this.http.post(this.globalVar.apiAddDataUrl, myData).subscribe( data=> {  
      loading.dismiss();
      this.viewCtrl.dismiss(addContent);
      console.log('from php '+JSON.parse(data["_body"]));
    }, err =>{
      console.log(err);  
    });   
  }
}
