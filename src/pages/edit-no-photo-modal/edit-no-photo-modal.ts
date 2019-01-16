import { Component,NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';

/**
 * Generated class for the EditNoPhotoModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-no-photo-modal',
  templateUrl: 'edit-no-photo-modal.html',
})
export class EditNoPhotoModalPage {

  type: string;
  details: any;
  ori_details:any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public http: Http,  
    private globalVar: GlobalVarProvider, public loadingCtrl: LoadingController,
    private zone:NgZone, private log:LoggerProvider) {

    this.type = navParams.get('type');    
    this.details = navParams.get('details');    
    this.ori_details = JSON.parse(JSON.stringify(this.details));
    
  }

  ionViewDidLoad() {
    this.log.logActivity('edit '+this.type);
  }



  cancel(){
   
    this.zone.run(() =>{
      this.details = JSON.parse(JSON.stringify(this.ori_details));
    });
    this.dismiss();
  }

  dismiss() {
    //console.log("profile " + this.details.ProfilePic);
    this.viewCtrl.dismiss(this.details);
  }

  update(updateType:string) {
    
    var myData = JSON.stringify({requestType: updateType, details:this.details});
    
    
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'updating changes',
    });

    loading.present();
    

    this.http.post(this.globalVar.apiUpdateDataUrl, myData).subscribe( data=> {  
      loading.dismiss();
         
      this.ori_details = JSON.parse(JSON.stringify(this.details));

      this.dismiss(); 
      console.log('from php '+JSON.parse(data["_body"]));
    }, err =>{
      console.log(err);  
    });   


    
  }
}
