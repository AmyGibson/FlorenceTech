import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams, ViewController, AlertController  } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
//import { FlickrProvider } from '../../providers/flickr/flickr';
import { FlickrAuthProvider } from '../../providers/flickr-auth/flickr-auth';
import { LoggerProvider } from '../../providers/logger/logger';
/**
 * Generated class for the EditModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-modal',
  templateUrl: 'edit-modal.html',
})
export class EditModalPage {

  //myDate:string;
  type: string;
  details: any;
  ori_details:any;
  photoPaths:string[];
  imgUrl:string;
  imagesToAdd: string[];
  photoSelected: boolean[];
  tempProfile:any;
  


  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public viewCtrl: ViewController, public http: Http,  
    private globalVar: GlobalVarProvider, public loadingCtrl: LoadingController,
    private zone:NgZone, private flickrAuth:FlickrAuthProvider, private alertCtrl: AlertController,
    private log:LoggerProvider) {

    this.type = navParams.get('type');
    //console.log(this.type);
    this.details = navParams.get('details');    
    this.ori_details = JSON.parse(JSON.stringify(this.details));
    this.imgUrl = globalVar.imgUrl;
    if (this.type == "background" || this.type == "family" || this.type == "roles" 
    || this.type == "impPeople"){
      this.photoPaths = this.extractPhotoPath(this.details.Photo);
    }
    if (this.type == "profile"){
      if (this.details.ProfilePic != ""){
        this.tempProfile = this.details.ProfilePic;
      }else{
        this.tempProfile = this.imgUrl + "blank-profile.png";
      }
    }
  }

  ionViewDidLoad() {
    this.log.logActivity('edit '+this.type);
  }

  // only for editing profile
  changeProfile(i:number){
    this.tempProfile = this.imagesToAdd[i];
  }

  // takes a string and return an array of individual photo paths
  extractPhotoPath(currentPhotos:string){
    if (currentPhotos == ""){
      return null;
    }

    let photoArray = currentPhotos.split(',');
          
    if (photoArray[0] == ""){
      photoArray = photoArray.slice(1,photoArray.length);
    }
    for (let i = 0; i < photoArray.length; i++){
      if (photoArray[i].indexOf('http') == -1 && photoArray[i]!=""){
        photoArray[i] = this.imgUrl + photoArray[i];
      }
    }
    return photoArray;
        
  }
  
  removePhoto(i:number){
    this.photoPaths.splice(i,1);
  }

  loadAllImgs(){

    if (this.globalVar.flickrLoggedIn){
      let loading = this.loadingCtrl.create({
        spinner: 'circles',
        content: 'loading photos',
      });
      loading.present();
      
      //this.flickr.getAllPublicPhotos().then(data=>{
      this.flickrAuth.getAllPhotos().then(data=>{
        this.imagesToAdd = data;
        this.photoSelected = new Array(this.imagesToAdd.length);
        loading.dismiss();
      });
    }else{
      let alert = this.alertCtrl.create({
        title: 'Not logged in to Flickr',
        subTitle: 'Please go to home screen to log in to Flickr',
        buttons: ['Dismiss']
      });
      alert.present();
    }
    
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


  updateBackgroundPhotos(){
    let photoPathStr = "";
    
    if (this.photoPaths != null && this.photoPaths != []) {
      for (let i = 0; i < this.photoPaths.length; i++){
        if (i == 0){
          photoPathStr = this.photoPaths[i];         
        }else{
          photoPathStr = photoPathStr + ',' + this.photoPaths[i];
        }    
      }
    }
    
    if (this.photoSelected != null ) {
      for (let i = 0; i < this.photoSelected.length; i++){
        if (this.photoSelected[i]){
          if (photoPathStr == ""){
            photoPathStr = this.imagesToAdd[i];   
          }else{
            photoPathStr = photoPathStr + ',' + this.imagesToAdd[i];
          }   
          if (this.photoPaths == null){
            this.photoPaths = new Array(this.imagesToAdd[i]);
          }else{
            this.photoPaths.push(this.imagesToAdd[i]); 
          }   
        }
      }
    }

    this.details.Photo = photoPathStr;
  }

  update(updateType:string) {

    if (updateType == "background" || updateType == "family" || updateType=="roles"
    || updateType=="impPeople"){
      this.updateBackgroundPhotos();
    }

    if (updateType == "profile"){
      this.details.ProfilePic = this.tempProfile;
    }

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
