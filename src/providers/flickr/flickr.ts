import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import{forkJoin} from 'rxjs/Observable/forkJoin';
/*
  this is for public flickr photos
  without authenication

*/
@Injectable()
export class FlickrProvider {

  private apiKey = 'apiKey';
  private endpoint = 'https://api.flickr.com/services/rest/';
  private secret = 'secret';
  private userID = 'userID';

  private photoDetails:string[];
  private photoIDs:string[];
  private photoUrls:string[];
  private photoDescriptions:string[];
  private photoSize = 5;//"Medium";//see api for more sizes

  

  constructor(public http: HttpClient, public jsonp: HttpClientJsonpModule) {
    console.log('Hello FlickrProvider Provider');
  }

  requestPhotos(){
    const url = this.endpoint+"?method=flickr.people.getPublicPhotos&api_key=" +
    this.apiKey + "&user_id="+ this.userID+
    "&extras=url_z, description&format=json&jsoncallback=JSONP_CALLBACK";

    return this.http.jsonp(url, 'callback');
   }

  // the input should be the result from getPublicPhotos
  private setPhotoIDsandDes(){
    this.photoIDs = new Array(this.photoDetails.length);
    this.photoDescriptions = new Array(this.photoDetails.length);
    for (let i = 0; i < this.photoDetails.length; i++){
      this.photoIDs[i] = this.photoDetails[i]['id']
      let tempDesc = this.photoDetails[i]['description'];
      this.photoDescriptions[i] = tempDesc['_content'];
    }
    

  }

  private requestUrl(photoID:string){
    const url = this.endpoint+"?method=flickr.photos.getSizes&api_key=" +
    this.apiKey + "&photo_id="+ photoID+ "&format=json&jsoncallback=JSONP_CALLBACK";

    return this.http.jsonp(url, 'callback');
  }

  private requestPhotoUrlsForkJoin(){
    let urls:any[] = [];
    for (let i = 0; i < this.photoIDs.length; i++){
      urls.push(this.requestUrl(this.photoIDs[i]));      
    }
    return forkJoin(urls);
  }
  

  setPhotoUrls(): Promise<any>{
    this.photoUrls = new Array(this.photoIDs.length);
    
    return new Promise((resolve, reject) =>{
      this.requestPhotoUrlsForkJoin().subscribe(res=>{
        for (let i = 0; i < this.photoIDs.length; i++){ 
          let entry = res[i]['sizes']['size'][this.photoSize];
          this.photoUrls[i] = entry['source'];
          //console.log(entry['source']);
        }
        resolve(this.photoUrls);
      
      }, error =>{
        reject(error);
      });
    });
  }



  // return an array of photos details
  getAllPublicPhotosDetails():Promise<any>{
   
    return new Promise((resolve, reject) =>{
      this.requestPhotos().subscribe(res=>{
        let photos = res["photos"];
      //  console.log(photos["photo"]);
        this.photoDetails = photos["photo"];
        this.setPhotoIDsandDes();
        resolve(0);
      }, error =>{
        reject(error);
      });
    });
  }

  getAllPublicPhotos(): Promise<any>{
    return new Promise((resolve, reject) => {
      this.getAllPublicPhotosDetails()
      .then(data =>{
        return this.setPhotoUrls();
      })
      .then(data=>{
//        console.log('2nd then');
//        console.log(data);
        resolve(this.photoUrls);
      });
    });
  }



  //getURL(id:number):string{
  //  return this.photoUrls[id];
  //}
  

}
