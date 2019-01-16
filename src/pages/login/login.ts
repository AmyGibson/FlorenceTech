import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  account: { username: string, password: string } = {
    username: 'test@email.com',
    password: 'test'
  };
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController, private storage:Storage,
    private globalVar:GlobalVarProvider, private http:Http,
    private menu:MenuController ) {
      // need to check if user already logged in
      // if yes: set global var with user id
      // redirect to home page
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
    this.menu.swipeEnable(false);
    this.storage.get('userID').then(
      data => {
        if(data) {
          //console.log(data);
          this.moveOn(data);          
        }else{
          //console.log('item doesnt exist in storage');
          this.globalVar.userID = null;
        }
      }, error => {console.error(error)}
    );
  }

  moveOn(uid:number){
    this.globalVar.userID = uid;
    //console.log('set global uid ' + this.globalVar.userID);
    this.navCtrl.setRoot('HomePage');
  }


  doLogin() {
    //console.log(this.account);
    //return null;
    if (this.account.username == "" || this.account.password == ""){
      let toast = this.toastCtrl.create({
        message: "please enter a username/password",
        duration: 3000,
        position: 'top'
      });
      toast.present(); 
      return null;
    }
    //let myData = JSON.stringify({ details:this.account});
    let myData = JSON.stringify(this.account);

    this.http.post(this.globalVar.loginUrl, myData).subscribe( data=> {  
      // it is possible it is a success but actuall with error
      // eg username doesnt exist is not an sql error
      // wrong password is also not  an sql error
     
      //console.log('from php '+JSON.parse(data["_body"]));
      
      let loginResponse = JSON.parse(data["_body"]);
      if (isNaN(loginResponse)){
        // is not a number, so a string in our case, so login fail
        let toast = this.toastCtrl.create({
          message: loginResponse,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }else{
        // the user id, loggin success
        console.log('log in success');

        this.storage.set('userID', loginResponse)
        .then(
          () => {
            //console.log('Stored item!')
            this.moveOn(loginResponse);           
          }, error => {
            console.error('Error storing item', error)
            // should still carry on
            this.moveOn(loginResponse);
          }
        );

      // store user id in native storage
        //this.navCtrl.push('HomePage');
      }
    }, err =>{
      console.log(err);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: "Log in error. Please try again",
        duration: 3000,
        position: 'top'
      });
      toast.present();  
    });

    
  }

}
