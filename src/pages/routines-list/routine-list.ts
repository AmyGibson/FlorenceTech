import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { GeneralRoutinePage } from '../general-routine/general-routine';

@IonicPage()
@Component({
    selector: 'page-routine-list',
    templateUrl: 'routine-list.html'
})

export class RoutineListPage{
    //selectedItem: any;
  
    //items: Array<{title: string, note:string}>;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        //this.selectedItem = navParams.get('item');
/*
        this.items = [];
        this.items.push({
            title: 'General routines',
            note: 'General routines description '
        });
        this.items.push({
            title: 'Specific routines',
            note: 'Specific routines description '
        });
*/
      
    }

    generalRoutineTapped(event) {
        this.navCtrl.push('GeneralRoutinePage');
    }
    specificRoutineTapped(event) {
        this.navCtrl.push('SpecificRoutinesPage');
    }
}