import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CommunicationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-communication-list',
  templateUrl: 'communication-list.html',
})
export class CommunicationListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
   // console.log('ionViewDidLoad CommunicationListPage');
  }

  startersTapped(event) {
    this.navCtrl.push('GenericCommPage', {type:'starters'});
  }
  specialTapped(event) {
      this.navCtrl.push('GenericCommPage', {type:'specialInterests'});
  }
  avoidTapped(event) {
    this.navCtrl.push('GenericCommPage', {type:'avoid'});
  }
  generalTapped(event) {
      this.navCtrl.push('GenericCommPage', {type:'general'});
  }
  worriesTapped(event) {
    this.navCtrl.push('GenericCommPage', {type:'worries'});
  }

}
