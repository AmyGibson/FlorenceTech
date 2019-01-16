import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';

/**
 * Generated class for the RolesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-roles',
  templateUrl: 'roles.html',
})
export class RolesPage {

  roles:any;
  photos: any[]= [];
  requestType = "roles";
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
      private globalVar: GlobalVarProvider, public modalCtrl: ModalController,
      private log:LoggerProvider) {   
    
   
  }

  ionViewDidLoad() {
    
    if (isNaN(this.globalVar.userID)){
      this.navCtrl.setRoot('LoginPage');
    }else{
      this.log.logActivity('important roles');
      this.getData();
    }
    
  }

  
  getData(){
    
    var myData = JSON.stringify({requestType: this.requestType, ID:this.globalVar.userID});
   
    return this.http.post(this.globalVar.apiGetDataUrl, myData).subscribe( data=> {
      
      this.roles = JSON.parse(data["_body"]);
      this.photos = new Array();
      for (var i = 0; i < this.roles.length; i++){
        if (this.roles[i].Photo == ""){
          this.photos.push(this.roles[i].Photo);
        }else{
          let photoArray = this.globalVar.convertPhotoStrToArray(this.roles[i].Photo);         
          this.photos.push(photoArray);         
        }
      }
    });  
    
  }

  // use the uniqueId just to reduce the chance of mistake if delete is allowed
  openEditingModal(roleID:number) {
    //console.log(roleID);
    
    let index = this.roles.findIndex(x => x.RoleID == roleID);        
    let content = this.roles[index];
   // console.log(content);
    
    const myModal = this.modalCtrl.create('EditModalPage', { 'type':this.requestType,
      'details': content });
    myModal.onDidDismiss(modalData=>{      
      this.roles[index] = modalData;
      this.photos[index] = this.globalVar.convertPhotoStrToArray(modalData.Photo);
    });
    myModal.present(); 
  }

  addRole() {
    //console.log('add');
    
    const myModal = this.modalCtrl.create('ItemCreatePage', 
    { 'type':this.requestType});
    myModal.onDidDismiss(modalData=>{
      if (modalData) {
        this.roles.push(modalData);
        this.photos[this.roles.length-1] = this.globalVar.convertPhotoStrToArray(modalData.Photo);        
      }
      this.getData();
    });
    myModal.present(); 
  
  }

}
