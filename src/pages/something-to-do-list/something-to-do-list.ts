import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SomethingToDoListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-something-to-do-list',
  templateUrl: 'something-to-do-list.html',
})
export class SomethingToDoListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SomethingToDoListPage');
  }

  sensoryTapped(event) {
    this.navCtrl.push('EnvironmentPage');
  }
  mediaTapped(event) {
      this.navCtrl.push('PreferredMediaPage');
  }
  otherTapped(event) {
    this.navCtrl.push('PreferredOtherPage');
  }

}
