import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotifyPlaylistPage } from './spotify-playlist';

@NgModule({
  declarations: [
    SpotifyPlaylistPage,
  ],
  imports: [
    IonicPageModule.forChild(SpotifyPlaylistPage),
  ],
})
export class SpotifyPlaylistPageModule {}
