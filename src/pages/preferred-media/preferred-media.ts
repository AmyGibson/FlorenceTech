import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, 
  LoadingController, Loading, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import SpotifyWebApi from 'spotify-web-api-js';
import { Storage } from '@ionic/storage';
import { LoggerProvider } from '../../providers/logger/logger';

declare var cordova: any;

/**
 * Generated class for the PreferredMediaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-preferred-media',
  templateUrl: 'preferred-media.html',
})
export class PreferredMediaPage {

  radio = new Array();
  tv = new Array();
  movies = new Array();  
  books = new Array();
  music = new Array();
  others = new Array();
  requestType = "media";
  
  spotifyClientID = 'spotifyClientID';
  spotifyLoggedIn = false;
  loading: Loading;
  spotifyAccessToken = null;
  playlists = [];
  spotifyApi: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,  
    private globalVar: GlobalVarProvider, public modalCtrl: ModalController,
    private alertCtrl: AlertController, private storage: Storage, 
    private plt: Platform, private loadingCtrl: LoadingController,
    private log:LoggerProvider) {
      /*this.radio = new Array();
      this.tv = new Array();
      this.movies = new Array();
      this.books = new Array();
      this.music = new Array();
      this.others = new Array();
      console.log(this.radio.length);*/

      this.spotifyApi = new SpotifyWebApi();

      this.plt.ready().then(() => {
        this.storage.get('spotify_logged_in').then(res => {
          if (res) {
            //this.spotifyLoggedIn = true;
            this.authWithSpotify(true);
          }
        });
      });

  }

  ionViewDidLoad() {
    if (isNaN(this.globalVar.userID)){
      this.navCtrl.setRoot('LoginPage');
    }else{
      this.log.logActivity('preferred media');
      this.getData();
    }
  }


  presentConfirm(mediaID:number, meidaType:string) {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Are you sure to delete this entry?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.removeRoutine(mediaID, meidaType);
            //console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  removeRoutine(mediaID:number, meidaType){
    var myData = JSON.stringify({requestType: this.requestType, MediaID:mediaID});
    this.http.post(this.globalVar.apiRemoveDataUrl, myData).subscribe( data=> {
      console.log('from php '+JSON.parse(data["_body"]));  
      
      if (meidaType == "Radio") {
        let index = this.radio.findIndex(x => x.MediaID == mediaID);
        this.radio.splice(index, 1);
      }else if (meidaType == "TV") {
        let index = this.tv.findIndex(x => x.MediaID == mediaID);
        this.tv.splice(index, 1);
      }else if (meidaType == "Books") {
        let index = this.books.findIndex(x => x.MediaID == mediaID);
        this.books.splice(index, 1);
      }else if (meidaType == "Movies") {
        let index = this.movies.findIndex(x => x.MediaID == mediaID);
        this.movies.splice(index, 1);
      }else if (meidaType == "Music") {
        let index = this.music.findIndex(x => x.MediaID == mediaID);
        this.music.splice(index, 1);
      }else if (meidaType == "Other") {
        let index = this.others.findIndex(x => x.MediaID == mediaID);
        this.others.splice(index, 1);
      }
      
    });  

  }

  getData(){
    
    var myData = JSON.stringify({requestType: this.requestType, ID:this.globalVar.userID});
   
    return this.http.post(this.globalVar.apiGetDataUrl, myData).subscribe( data=> {
      
      let allEntries = JSON.parse(data["_body"]);
      
      for (let i =  0; i < allEntries.length; i++){
        if (allEntries[i].Type == "Radio"){
          this.radio.push(allEntries[i]);
          //console.log(allEntries[i]);
        }else if (allEntries[i].Type == "TV"){
          this.tv.push(allEntries[i]);
        }else if (allEntries[i].Type == "Books"){
          this.books.push(allEntries[i]);
        }else if (allEntries[i].Type == "Movies"){
          this.movies.push(allEntries[i]);
        }else if (allEntries[i].Type == "Music"){
          this.music.push(allEntries[i]);
        }else if (allEntries[i].Type == "Other"){
          this.others.push(allEntries[i]);
        }
      }

    });  
    
  }

  addMedia(){
    
    const myModal = this.modalCtrl.create('ItemCreatePage', 
    { 'type':this.requestType});
    myModal.onDidDismiss(modalData=>{
      //console.log(modalData);
      if (modalData) {
        if (modalData.Type == "Radio"){
          this.radio.push(modalData);
        }else if (modalData.Type == "TV"){
          this.tv.push(modalData);
        }else if (modalData.Type == "Books"){
          this.books.push(modalData);
        }else if (modalData.Type == "Movies"){
          this.movies.push(modalData);
        }else if (modalData.Type == "Music"){
          this.music.push(modalData);
        }else if (modalData.Type == "Other"){
          this.others.push(modalData);
        }      
      }
      this.getData();
    });
    myModal.present(); 

  }
  
  openEditingModal(mediaID:number, mediaType:string) {
   
    let content:any;
    let index:number;
    if (mediaType == "Radio") {
      index = this.radio.findIndex(x => x.MediaID == mediaID);
      content = this.radio[index];
    }else if (mediaType == "TV") {
      index = this.tv.findIndex(x => x.MediaID == mediaID);
      content = this.tv[index];
    }else if (mediaType == "Books") {
      index = this.books.findIndex(x => x.MediaID == mediaID);
      content = this.books[index];
    }else if (mediaType == "Movies") {
      index = this.movies.findIndex(x => x.MediaID == mediaID);
      content = this.movies[index];
    }else if (mediaType == "Music") {
      index = this.music.findIndex(x => x.MediaID == mediaID);
      content = this.music[index];
    }else if (mediaType == "Other") {
      index = this.others.findIndex(x => x.MediaID == mediaID);
      content = this.others[index];
    } 
    
      
    const myModal = this.modalCtrl.create('EditNoPhotoModalPage', { 'type':this.requestType,
      'details': content });
    myModal.onDidDismiss(modalData=>{ 
      
      if (mediaType == "Radio") {
        this.radio[index] = modalData;
      }else if (mediaType == "TV") {
        this.tv[index] = modalData;
      }else if (mediaType == "Books") {
        this.books[index] = modalData;
      }else if (mediaType == "Movies") {
        this.movies[index] = modalData;
      }else if (mediaType == "Music") {
        this.music[index] = modalData;
      }else if (mediaType == "Other") {
        this.others[index] = modalData;
      } 

    });
    myModal.present(); 
  }

  authWithSpotify(showLoading = false) {
    console.log("authWithSpotify ");
    const config = {
      clientId: this.spotifyClientID,
      redirectUrl: "florencespotify://callback",
      scopes: ["streaming", "playlist-read-private", "user-read-email", "user-read-private"],
      tokenExchangeUrl: "https://florence-tech.herokuapp.com/exchange",
      tokenRefreshUrl: "https://florence-tech.herokuapp.com/refresh",
    };
 
    if (showLoading) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }

    cordova.plugins.spotifyAuth.authorize(config)
      .then(({ accessToken, encryptedRefreshToken, expiresAt }) => {
        if (this.loading) {
          this.loading.dismiss();
        }
        this.spotifyAccessToken = accessToken;
        //this.result = { access_token: accessToken, expires_in: expiresAt, 
        //  ref: encryptedRefreshToken };
        console.log("accessToken: " + accessToken);
        this.spotifyLoggedIn = true;
        this.spotifyApi.setAccessToken(accessToken);
        this.getUserPlaylists();
        this.storage.set('spotify_logged_in', true);
      }, err => {
        console.error(err);
        this.spotifyLoggedIn = false;
        this.storage.set('spotify_logged_in', false);
        if (this.loading) {
          this.loading.dismiss();
        }
      });
  }

  getUserPlaylists() {
    this.loading = this.loadingCtrl.create({
      content: "Loading Playlists...",
    });
    this.loading.present();
 
    this.spotifyApi.getUserPlaylists()
      .then(data => {
        if (this.loading) {
          this.loading.dismiss();
        }
        this.playlists = data.items;
      }, err => {
        console.error(err);
        if (this.loading) {
          this.loading.dismiss();
        }
      });
  }
 
  openPlaylist(item) {
    this.navCtrl.push('SpotifyPlaylistPage', { playlist: item, access: this.spotifyAccessToken, 
      clientID: this.spotifyClientID });
  }

  logout() {
    // Should be a promise but isn't
    cordova.plugins.spotifyAuth.forget();
 
    this.spotifyLoggedIn = false;
    this.playlists = [];
    this.storage.set('spotify_logged_in', false);
  }


}
