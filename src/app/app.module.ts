import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Item } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
//import { NativeStorage } from '@ionic-native/native-storage';

import { MyApp } from './app.component';
import { ListPage } from '../pages/list/list';
import { ItemDetailsPage } from '../pages/item-details/item-details'
import { GlobalVarProvider } from '../providers/global-var/global-var';
import { FlickrProvider } from '../providers/flickr/flickr';
import {NgCalendarModule} from 'ionic2-calendar';
import { FlickrAuthProvider } from '../providers/flickr-auth/flickr-auth';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LoggerProvider } from '../providers/logger/logger';

@NgModule({
  declarations: [
    MyApp,
    ItemDetailsPage,
    ListPage
  ],
  imports: [
    NgCalendarModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    HttpClientJsonpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ItemDetailsPage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
   // NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalVarProvider,
    FlickrProvider,
    FlickrAuthProvider,    
    InAppBrowser,
    LoggerProvider
  ]
})
export class AppModule {}
