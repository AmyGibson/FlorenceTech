import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
//import { Storage } from '@ionic/storage';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
//import { EditModalPage } from '../edit-modal/edit-modal';
import { LoggerProvider } from '../../providers/logger/logger';

@IonicPage()
@Component({
    selector: 'page-personal-details',
    templateUrl: 'personal-details.html'
})

export class PersonalDetailsPage{
    
  profile:any;
  //photos: any[]= [];
  requestType = "profile";
  imgUrl :string; 
  tempProfile:number;
  //myParam = ''; 

  constructor(public navCtrl: NavController, public http: Http,  
      private globalVar: GlobalVarProvider, public modalCtrl: ModalController, 
      private log:LoggerProvider){
  
    this.imgUrl = globalVar.imgUrl;
    this.tempProfile = 0;
  }

  ionViewDidLoad(){
    //console.log('uid ' + this.globalVar.userID);
    if (isNaN(this.globalVar.userID)){
      this.navCtrl.setRoot('LoginPage');
    }else{
      this.log.logActivity('Profile');
      this.getData();
    }
  }

  fixLocalImgPath(oriPath:string){
    let newPath = oriPath;
    if (oriPath.indexOf('http') == -1 && oriPath!=""){
      newPath = this.imgUrl + oriPath;
    }
    return newPath;
  }

  getData(){
    //console.log(this.globalVar.userID); 
    var myData = JSON.stringify({requestType: this.requestType, ID:this.globalVar.userID});
    
    return this.http.post(this.globalVar.apiGetDataUrl, myData).subscribe( data=> { 
        
      this.profile = JSON.parse(data["_body"]);
     // console.log(this.profile); 
      this.profile.ProfilePic = this.fixLocalImgPath(this.profile.ProfilePic);
      if (this.profile.ProfilePic != ""){
        this.tempProfile = 1;
      }
      //console.log(this.profile);
    }, err =>{
      console.log(err);  
    });  
    
  }

  openEditingModal() {
    

    const myModal = this.modalCtrl.create('EditModalPage', { 'type':'profile',
      'details': this.profile });
    myModal.onDidDismiss(modalData=>{
      this.profile = modalData;
    });
    myModal.present();
  }
}