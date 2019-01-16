import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';
/**
 * Generated class for the ImportantPeoplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-important-people',
  templateUrl: 'important-people.html',
})
export class ImportantPeoplePage {

  people:any;
  photos: any[]= [];
  requestType = "impPeople";
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
      this.log.logActivity('important people');
      this.getData();
    }
  }

 

  getData(){
    
    var myData = JSON.stringify({requestType: this.requestType, ID:this.globalVar.userID});
   
    return this.http.post(this.globalVar.apiGetDataUrl, myData).subscribe( data=> {
     
      this.people = JSON.parse(data["_body"]);
      this.photos = new Array();
      for (var i = 0; i < this.people.length; i++){
        if (this.people[i].Photo == ""){
          this.photos.push(this.people[i].Photo);
        }else{

          let photoArray = this.globalVar.convertPhotoStrToArray(this.people[i].Photo);         
          this.photos.push(photoArray);         
        }
      }
    });  
    
  }

  // use the uniqueId just to reduce the chance of mistake if delete is allowed
  openEditingModal(impPeopleID:number) {
   
    
    let index = this.people.findIndex(x => x.ImpPeopleID == impPeopleID);        
    let content = this.people[index];
    
    
    const myModal = this.modalCtrl.create('EditModalPage', { 'type':this.requestType,
      'details': content });
    myModal.onDidDismiss(modalData=>{      
      this.people[index] = modalData;
      this.photos[index] = this.globalVar.convertPhotoStrToArray(modalData.Photo);
    });
    myModal.present(); 
  }

  addPeople() {
    //console.log('add');
    
    const myModal = this.modalCtrl.create('ItemCreatePage', 
    { 'type':this.requestType});
    myModal.onDidDismiss(modalData=>{
      if (modalData) {
        this.people.push(modalData);
        this.photos[this.people.length-1] = this.globalVar.convertPhotoStrToArray(modalData.Photo);
      }
      this.getData();
    });
    myModal.present(); 
  
  }

}
