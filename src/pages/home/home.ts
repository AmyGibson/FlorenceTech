import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { FlickrAuthProvider } from '../../providers/flickr-auth/flickr-auth';
import { LoggerProvider } from '../../providers/logger/logger';
//import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  flickrLoggedIn = false;
  constructor(public navCtrl: NavController, private globalVar:GlobalVarProvider, 
    private flickrAuth:FlickrAuthProvider, private log:LoggerProvider) { 

    this.flickrAuth.checkAndLoadAuthDetails().then(data =>{
      this.globalVar.flickrLoggedIn = data;
      this.flickrLoggedIn = data;
    });
    
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad HomePage ' + this.globalVar.userID);
    if (isNaN(this.globalVar.userID)){
      this.navCtrl.setRoot('LoginPage');
    }else{
      this.log.logActivity('home');
    }
    
  }

  flickrAuthenticate(){
    this.flickrAuth.phpAuthenticate();
    this.flickrAuth.checkAndLoadAuthDetails().then(data =>{
      this.globalVar.flickrLoggedIn = data;
      this.flickrLoggedIn = data;
    });
  }

}
