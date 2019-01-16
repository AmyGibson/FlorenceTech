import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import SpotifyWebApi from 'spotify-web-api-js';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-spotify-playlist',
  templateUrl: 'spotify-playlist.html',
})
export class SpotifyPlaylistPage {

  spotifyApi: any;
  loading: Loading;
  playlistInfo = null;
  tracks = [];
 
  playing = false
  paused = false;
 
  clientID = null;
  accessToken = null
 
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private loadingCtrl: LoadingController) {
      
    this.clientID = this.navParams.get('clientID');
    this.accessToken = this.navParams.get('access');

    let playlist = this.navParams.get('playlist');
    this.spotifyApi = new SpotifyWebApi();
 
    this.loadPlaylistData(playlist);
  }
 
  loadPlaylistData(playlist) {
    this.loading = this.loadingCtrl.create({
      content: "Loading Tracks...",
    });
    this.loading.present();
    //console.log(playlist.owner.id);
 
    //playlist.owner.id, 
    this.spotifyApi.getPlaylist(playlist.id).then(data => {
      this.playlistInfo = data;
      this.tracks = data.tracks.items;
      if (this.loading) {
        this.loading.dismiss();
      }
    }, err => {
      console.error(err.description);
      if (this.loading) {
        this.loading.dismiss();
      }
    });
  }
 
  play(item) {
    //console.log("item.track.uri " + item.track.uri);
    //console.log("this.clientID " + this.clientID);
    //console.log("this.accessToken " + this.accessToken);
    cordova.plugins.spotify.play(item.track.uri, {
      clientId: this.clientID,
      token: this.accessToken
    })
      .then(() => {
        this.playing = true;
        this.paused = false;
      });
  }
 
  pause() {
    cordova.plugins.spotify.pause()
      .then(() => {
        this.playing = false;
        this.paused = true;
      });
  }
 
  resume()  {
    cordova.plugins.spotify.resume()
      .then(() => {
        this.playing = true;
        this.paused = false;
      });
  }
 
  seekTo() {
    cordova.plugins.spotify.seekTo(1000 * 120)
      .then(() => console.log(`Skipped forward`))
  }

  open(item) {
    window.open(item.track.external_urls.spotify, '_system', 'location=yes');
  }

}
