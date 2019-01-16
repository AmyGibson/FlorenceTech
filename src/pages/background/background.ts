import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';

@IonicPage()
@Component({
  selector: 'page-background',
  templateUrl: 'background.html',
})
export class BackgroundPage {

  backgrounds:any;
  photos: any[]= [];
  requestType = "background";
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
      this.log.logActivity('background');
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
      this.backgrounds = JSON.parse(data["_body"]);
      for (var i = 0; i < this.backgrounds.length; i++){
        if (this.backgrounds[i].Photo == ""){
          this.photos.push(this.backgrounds[i].Photo);
        }else{

          let photoArray = this.convertPhotoStrToArray(this.backgrounds[i].Photo);
          //let photoArray = this.backgrounds[i].Photo.split(',');
          
          /*for (let i = 0; i < photoArray.length; i++){
            if (photoArray[i].indexOf('http') == -1 && photoArray[i]!=""){
              photoArray[i] = this.imgUrl + photoArray[i];
            }
          }*/
          this.photos.push(photoArray);         
        }
      }
    });  
    
  }

  /*findChronoOrder(srcArray, attr, value){
    
    for(var i = 0; i < srcArray.length; i += 1) {
      if(srcArray[i][attr] === value) {
          return i;
      }
    }
    return -1;
  }*/

  openEditingModal(eventIndex) {
   
    let index = this.backgrounds.findIndex(x => x.ChronoOrder == (eventIndex+1).toString());
    //let index = this.findChronoOrder(this.backgrounds, 'ChronoOrder',  (eventIndex+1).toString());
    //console.log(index);
    let content = this.backgrounds[index];

    //console.log(content);

     const myModal = this.modalCtrl.create('EditModalPage', { 'type':this.requestType,
      'details': content });
    myModal.onDidDismiss(modalData=>{      
      this.backgrounds[index] = modalData;
      this.photos[index] = this.convertPhotoStrToArray(modalData.Photo);
    });
    myModal.present(); 
  }

  addBackground() {
    
    const myModal = this.modalCtrl.create('ItemCreatePage', 
    { 'type':this.requestType, 'itemID':this.backgrounds.length + 1});
    myModal.onDidDismiss(modalData=>{
      if (modalData) {
       // console.log(modalData);
        this.backgrounds.push(modalData);
        this.photos[this.backgrounds.length-1] = this.convertPhotoStrToArray(modalData.Photo);
      }
      this.getData();
    });
    myModal.present(); 
  
  }

}
