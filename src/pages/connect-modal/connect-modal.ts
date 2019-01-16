import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { LoggerProvider } from '../../providers/logger/logger';
import { ThrowStmt } from '@angular/compiler';
/**
 * Generated class for the ConnectModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-connect-modal',
  templateUrl: 'connect-modal.html',
})
export class ConnectModalPage {
  isReady: boolean;
  //item: any;
  form: FormGroup;
  type: string;
  
  userID:number;
  carer:any;
  message:string;
  account = {
    Username: '',
    Password: '',
    Name:'',
    PatientID:0
  };

  //mediaType:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, public http: Http,  
    private globalVar: GlobalVarProvider, public loadingCtrl: LoadingController,
    private log:LoggerProvider, public viewCtrl: ViewController) {

    this.type = navParams.get('type');    
    this.userID = this.globalVar.userID;
    this.account.PatientID = this.userID;
    
    
    if (this.type == "addCarer"){
      
      this.form = this.formBuilder.group({
        username: ['', Validators.required], 
        password: ['', Validators.required],
        name: ['', Validators.required]
      });
    }

    if (this.type == "advertiseCarer"){
      this.carer = navParams.get('carer'); //CarerID, Name    
      this.form = this.formBuilder.group({
        message: ['', Validators.required], 
      });
    }
    

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReady = this.form.valid;
    });


  }

  ionViewDidLoad() {
    this.log.logActivity('connect '+this.type);
  }


  advertise(){
    console.log(this.type);

    let message = {
      CarerID: this.carer.CarerID,
      Message: this.message
    }

    let myData = JSON.stringify({requestType: this.type, details:message});
    //console.log(myData);
    
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Adding entry',
    });

    loading.present();
    

    this.http.post(this.globalVar.apiConnectUrl, myData).subscribe( data=> {  
      loading.dismiss();       
      
      this.viewCtrl.dismiss();
      //console.log('from php '+JSON.parse(data["_body"]));
      console.log('from php '+JSON.stringify(JSON.parse(data["_body"])));
    }, err =>{
      console.log(err);  
    });  
  }


  register(){
    
    let myData = JSON.stringify({requestType: this.type, details:this.account});
    //console.log(myData);
    
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Adding entry',
    });

    loading.present();
    

    this.http.post(this.globalVar.apiAddDataUrl, myData).subscribe( data=> {  
      loading.dismiss();       
      
      this.viewCtrl.dismiss();
      //console.log('from php '+JSON.parse(data["_body"]));
      console.log('from php '+JSON.stringify(JSON.parse(data["_body"])));
    }, err =>{
      console.log(err);  
    });  

  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

}
