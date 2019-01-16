import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-life-history-list',
  templateUrl: 'life-history-list.html',
})
export class LifeHistoryListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LifeHistoryListPage');
  }

  backgroundTapped(event) {
    this.navCtrl.push('BackgroundPage');
  }

  familyTapped(event) {
    this.navCtrl.push('FamilyPage');
  }
  rolesTapped(event){
    this.navCtrl.push('RolesPage');
  }
  impPeopleTapped(event){
    this.navCtrl.push('ImportantPeoplePage');
  }
}
