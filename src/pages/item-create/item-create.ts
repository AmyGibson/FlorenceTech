import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, ViewController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
//import { FlickrProvider } from '../../providers/flickr/flickr';
import { FlickrAuthProvider } from '../../providers/flickr-auth/flickr-auth';
import { LoggerProvider } from '../../providers/logger/logger';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  //item: any;
  form: FormGroup;
  type: string;
  itemID: number;
  imagesToAdd: string[];
  photoSelected: boolean[];
  userID:number;
  routineType:string;
  //mediaType:any;
  

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, 
    formBuilder: FormBuilder, public navParams: NavParams, public http: Http,  
    private globalVar: GlobalVarProvider, public loadingCtrl: LoadingController,
    private flickrAuth:FlickrAuthProvider, private alertCtrl: AlertController, 
    private log:LoggerProvider) {

      
    this.type = navParams.get('type');
    
    this.userID = this.globalVar.userID;
    
    if (this.type == "background"){
      this.itemID = navParams.get('itemID');
      this.form = formBuilder.group({
        profilePic: [''], // this might have been named wrongly but photo paths are read seperately
        lifeEvent: ['', Validators.required]
      });
    }
    if (this.type == "family" || this.type == "impPeople"){
        this.form = formBuilder.group({        
        name: ['', Validators.required],
        relationship: [''],
        comment: ['']
      });
    }
    if (this.type == "roles"){
      this.form = formBuilder.group({        
        roleDetails: ['', Validators.required]      
      });
    }
    if (this.type == "generalRoutine"){
      this.routineType = navParams.get('routineType');
      this.form = formBuilder.group({        
        routineDetails: ['', Validators.required]      
      });  
    }
    if (this.type == "environment" || this.type == "otherActivities" || this.type =='starters'
    || this.type =='specialInterests' || this.type =='avoid' || this.type =='general' 
    || this.type =='worries' || this.type == 'medConditions' || this.type == 'specialists'){      
      this.form = formBuilder.group({        
        entryDetails: ['', Validators.required]      
      });  
    }

    if (this.type == "media"){      
      this.form = formBuilder.group({        
        mediaDetails: ['', Validators.required] ,
        mediaType: ['', Validators.required]    
      });  
    }

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {
    this.log.logActivity('add '+this.type);
  }

  

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  addItem(updateType:string) {
    let photoPaths = "";
    if (this.photoSelected != null){
      for (let i = 0; i < this.photoSelected.length; i++){
        if (this.photoSelected[i]){
          if (photoPaths == ""){
            photoPaths = this.imagesToAdd[i];
          }else{
            photoPaths = photoPaths + ',' + this.imagesToAdd[i];
          }
          //console.log(this.imagesToAdd[i]);
        }
      }
    }
    //console.log(photoPaths);
    let addContent:any;
    
    if (updateType == 'background'){
      addContent ={
        'ID':this.userID,
        'ChronoOrder': this.itemID,
        'Event': this.form.value.lifeEvent,
        'Photo': photoPaths,
      };
    }else if (updateType == 'family' || updateType == 'impPeople'){
      addContent ={
        'ID':this.userID,
        'Name': this.form.value.name,
        'Relationship': this.form.value.relationship,
        'Comment': this.form.value.comment,
        'Photo': photoPaths,
      };
    }else if (updateType == 'roles'){
      addContent ={
        'ID':this.userID,
        'Role': this.form.value.roleDetails,        
        'Photo': photoPaths
      };
    }else if (updateType == 'generalRoutine'){
      addContent ={
        'ID':this.userID,
        'Details': this.form.value.routineDetails,
        'Frequency': this.routineType
      };
    }else if (updateType == 'environment' || updateType == 'otherActivities' || updateType =='starters'
    || updateType =='specialInterests' || updateType =='avoid' || updateType =='general' || updateType =='worries'
    || updateType == 'medConditions' || updateType == 'specialists'){
      addContent ={
        'ID':this.userID,
        'Details': this.form.value.entryDetails
      };
    }else if (updateType == 'media'){
      addContent ={
        'ID':this.userID,
        'Type':this.form.value.mediaType,
        'Details': this.form.value.mediaDetails
      };
    }
    
    
    let myData = JSON.stringify({requestType: updateType, details:addContent});
    //console.log(addContent);
    //console.log(myData);
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Adding entry',
    });

    loading.present();
    

    this.http.post(this.globalVar.apiAddDataUrl, myData).subscribe( data=> {  
      loading.dismiss();
        
      //ID, ChronoOrder, Event, Photo
      this.viewCtrl.dismiss(addContent);
      console.log('from php '+JSON.parse(data["_body"]));
      //console.log('from php '+JSON.parse(data["_body"]));
    }, err =>{
      console.log(err);  
    });  
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);
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


}
