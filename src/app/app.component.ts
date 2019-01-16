import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav:Nav;
  //rootPage:any = 'HomePage';
  rootPage:any = 'LoginPage';
  pages: Array<{title:string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public storage:Storage
  ) {
    this.initializeApp();

    this.pages = [
      {title:'Home', component: 'HomePage'},      
      {title:'Personal details', component: 'PersonalDetailsPage'},
      {title:'Life history', component: 'LifeHistoryListPage'},
      {title:'Routines', component: 'RoutineListPage'},
      {title:'Something to do', component: 'SomethingToDoListPage'},
      {title:'Communication', component: 'CommunicationListPage'},
      {title:'Health', component: 'HealthListPage'},
      {title:'Message board', component: 'MessageBoardPage'},
      {title:'Connect', component: 'ConnectPage'},
      {title:'Logout', component:'LoginPage'},
    ];
  }

  openPage(page){
    this.menu.close();
    if (page.title == 'Logout'){
      this.storage.remove('userID').then(
        data => {
          this.nav.setRoot(page.component);
        }, error => {console.error(error)}
      );
    }else{
      this.nav.setRoot(page.component);
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}

