import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the FlickrAuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FlickrAuthProvider {

  /**
    * Key names for various authentication data items
    */
  private oauth_request_token = '';
  private oauth_request_token_secret = '';
  private oauth_verifier = '';
  private oauth_access_token = '';
  private oauth_access_token_secret = '';
  private userNSID = '';
  private permissions = 'read';
  public flickrLoggedIn = false;

  //other endpoints and call back see php files
  private authEndpoint = 'https://www.flickr.com/services/oauth/authorize';
  private phpauthURL = 'https://uqtng1-florence.uqcloud.net/php/Flickr/auth.php';
  private phpGetPhotosURL = 'https://uqtng1-florence.uqcloud.net/php/Flickr/getPhotos.php';

  constructor(public http: HttpClient, private iab:InAppBrowser, private storage:Storage, private loadingCtrl: LoadingController) {
    
  }


  public getAllPhotos():Promise<any>{
  
    return this.requestPhotos();
  }

  private requestPhotos():Promise<any>{

    let params={    
      'oauth_token':this.oauth_access_token,
      'oauth_token_secret':this.oauth_access_token_secret,
      'user_id': this.userNSID,
      'nojsoncallback':1
    };
    
    let myData = JSON.stringify(params);
    //console.log(myData);
    return new Promise((resolve, reject)=>{
      this.http.post(this.phpGetPhotosURL, myData).subscribe(data=>{
      let details = this.extractDetails(data["photos"]['photo']);
      resolve(details);
    });
    });


   }

  private extractDetails(photoArray){

    let photoIDs = new Array();
    let urls = new Array();
    for (let i = 0; i < photoArray.length; i++){
      let ph = photoArray[i];
     
      //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
     
      let url = 'https://farm' + ph['farm'] + '.staticflickr.com/' + ph['server'] + '/' + 
        ph['id'] + '_' + ph['secret'] +'_z.jpg';
      console.log('url ' +url);
      urls.push(url);
      photoIDs.push(ph['id']);
    }

    let details={    
      'photoIDs':photoIDs,
      'photoURLs':urls      
    };

    //return details;
    return urls;
  }




  /**
   * below are authentication code
   */


  public checkAndLoadAuthDetails():Promise<any>{

    return new Promise((resolve, reject)=>{
       this.storage.get('oauth_token').then(data => {
        if(data) {
          console.log('Flickr already logged in');
          this.oauth_access_token = data; 
          this.storage.get('oauth_token_secret').then(data => {
            this.oauth_access_token_secret = data;  
            this.storage.get('user_nsid').then(data => {
              this.userNSID = data;   
              resolve(true);
            }, error => {
              console.error(error);
              resolve(false);
            }); 
          }, error => {
            console.error(error);
            resolve(false);
          });
          
        }else{
          resolve(false);
        }
      }, error => {
        console.error(error);
        resolve(false);
      });
    });
  }
  

  public phpAuthenticate(){
    let paramsRequest ={
      'auth_type':'request'
    };
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Authenicating',
    });

    loading.present();
    let myData = JSON.stringify(paramsRequest);

    this.http.post(this.phpauthURL, myData).subscribe(data=>{
      console.log("data['oauth_token'] "+data['oauth_token']);
      if (data['oauth_token'] == '' || data['oauth_token'] == null){
        console.log('Failed to obtain request token: ' + data['errMsg']);
      }else{
        this.oauth_request_token = data['oauth_token'];
        this.oauth_request_token_secret = data['oauth_token_secret'];
        
        this.flickrLogin().then(res=>{
          //console.log('login done');
          
          this.oauth_verifier = res["oauth_verifier"];
          console.log('verifier: ' + this.oauth_verifier);
          let paramsAccess ={
            'auth_type':'access',
            'oauth_token':this.oauth_request_token,
            'oauth_token_secret':this.oauth_request_token_secret,
            'oauth_verifier': this.oauth_verifier
          };
          let myDataAccess = JSON.stringify(paramsAccess);
          this.http.post(this.phpauthURL, myDataAccess).subscribe(data=>{
           
            if (data['oauth_token'] == '' || data['oauth_token'] == null){
              console.log('Failed to obtain access token: ' + data['errMsg']);              
            }else{
              
              console.log("access token success");
              this.oauth_access_token = data['oauth_token'];
              this.oauth_access_token_secret = data['oauth_token_secret'];              
              this.userNSID = data['user_nsid'];
              
              this.storage.set('oauth_token', this.oauth_access_token).then(() => {
                
                this.storage.set('oauth_token_secret', this.oauth_access_token_secret).then(() => {
                  this.storage.set('user_nsid', this.userNSID).then(() => {
                    console.log('Stored item!');                      
                  }, error => {
                    console.error('Error storing item', error);                  
                  });          
                }, error => {
                  console.error('Error storing item', error);                  
                });           
              }, error => {
                console.error('Error storing item', error);                  
              });
              
            }
          });
        });
      }

      loading.dismiss();
      return null;
      
    }, error =>{
      console.log(error);
      loading.dismiss();
      return {'error':error};
      
    });

  }


  public flickrLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      //console.log('load browser');
     
      let url = this.authEndpoint + '?oauth_token=' + this.oauth_request_token+'&perms='+this.permissions;
      const browser = this.iab.create(url,'_blank', 'location=no'); 
            
      browser.on('loadstop').subscribe(event => {
        if ((event.url).indexOf("florencespotify") === 0) {
          browser.close();
          var responseParameters = ((event.url).split("?")[1]).split("&");
          var parsedResponse = {};
          for (var i = 0; i < responseParameters.length; i++) {
            parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
          }
          if (parsedResponse["oauth_verifier"] !== undefined && parsedResponse["oauth_verifier"] !== null) {
            resolve(parsedResponse);
          } else {
            reject("Problem authenticating");
          }
        }
      });
    });
  }



}
