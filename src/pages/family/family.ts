import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';

/**
 * Generated class for the FamilyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-family',
  templateUrl: 'family.html',
})
export class FamilyPage {

  family:any;
  photos: any[]= [];
  requestType = "family";
  imgUrl :string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
      private globalVar: GlobalVarProvider, public modalCtrl: ModalController, 
      private log:LoggerProvider) {
    
    this.imgUrl = globalVar.imgUrl;
   
  }

  ionViewDidLoad() {
    
    if (isNaN(this.globalVar.userID)){
      this.navCtrl.setRoot('LoginPage');
    }else{
      this.log.logActivity('family');
      this.getData();
    }
  }

  convertPhotoStrToArray(photoStr:string){
    let photoArray = photoStr.split(',');
          
    for (let i = 0; i < photoArray.length; i++){
      if (photoArray[i].indexOf('http') == -1 && photoArray[i]!=""){
        photoArray[i] = this.imgUrl + photoArray[i];
      }
    }
    return photoArray;
  }

  getData(){
    
    var myData = JSON.stringify({requestType: this.requestType, ID:this.globalVar.userID});
   
    return this.http.post(this.globalVar.apiGetDataUrl, myData).subscribe( data=> {
      this.photos = new Array();
      this.family = JSON.parse(data["_body"]);
      for (var i = 0; i < this.family.length; i++){
        if (this.family[i].Photo == ""){
          this.photos.push(this.family[i].Photo);
        }else{

          let photoArray = this.convertPhotoStrToArray(this.family[i].Photo);         
          this.photos.push(photoArray);         
        }
      }
    });  
    
  }

  // use the uniqueId just to reduce the chance of mistake if delete is allowed
  openEditingModal(familyID:number) {
   
    
    let index = this.family.findIndex(x => x.FamilyID == familyID);        
    let content = this.family[index];
    
    
    const myModal = this.modalCtrl.create('EditModalPage', { 'type':this.requestType,
      'details': content });
    myModal.onDidDismiss(modalData=>{      
      this.family[index] = modalData;
      this.photos[index] = this.convertPhotoStrToArray(modalData.Photo);
    });
    myModal.present(); 
  }

  addFamily() {
    //console.log('add');
    
    const myModal = this.modalCtrl.create('ItemCreatePage', 
    { 'type':this.requestType});
    myModal.onDidDismiss(modalData=>{
      if (modalData) {
        this.family.push(modalData);
        this.photos[this.family.length-1] = this.convertPhotoStrToArray(modalData.Photo);
      }
      this.getData();
    });
    myModal.present(); 
  
  }

}
