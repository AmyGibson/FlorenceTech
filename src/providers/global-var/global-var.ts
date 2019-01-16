import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalVarProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalVarProvider {

  apiGetDataUrl:string;
  apiUpdateDataUrl:string;
  apiAddDataUrl:string;
  apiRemoveDataUrl:string;
  imgUrl:string;
  loginUrl:string;
  userID: number;
  flickrLoggedIn:boolean;
  apiLogUrl:string;
  apiConnectUrl:string;

  constructor(public http: HttpClient) {
    this.apiGetDataUrl = 'https://uqtng1-florence.uqcloud.net/php/getData.php';
    this.apiAddDataUrl = 'https://uqtng1-florence.uqcloud.net/php/addData.php';
    this.apiUpdateDataUrl = 'https://uqtng1-florence.uqcloud.net/php/updateData.php';
    this.imgUrl = 'https://uqtng1-florence.uqcloud.net/img/';
    this.loginUrl = 'https://uqtng1-florence.uqcloud.net/php/login.php';
    this.apiRemoveDataUrl = 'https://uqtng1-florence.uqcloud.net/php/removeData.php';
    this.apiLogUrl = 'https://uqtng1-florence.uqcloud.net/php/log.php';
    this.apiConnectUrl = 'https://uqtng1-florence.uqcloud.net/php/connect.php';
  }
  
  convertPhotoStrToArray(photoStr:string){
    let photoArray = photoStr.split(',');
          
    for (let i = 0; i < photoArray.length; i++){
      if (photoArray[i].indexOf('http') == -1 && photoArray[i]!=""){
        photoArray[i] = this.imgUrl + photoArray[i];
      }
    }
    return photoArray;
  }
  
}
