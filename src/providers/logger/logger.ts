import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVarProvider } from '../../providers/global-var/global-var';
/*
  Generated class for the LoggerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoggerProvider {

  constructor(public http: HttpClient, private globalVar: GlobalVarProvider) {
    
  }

  public logActivity(page:string){
    let myData = JSON.stringify({ID: this.globalVar.userID, Page:page});
    //console.log(myData);
    
    this.http.post(this.globalVar.apiLogUrl, myData).subscribe( data=> {  
      console.log('from php '+data);
      //console.log('from php '+JSON.parse(data["_body"]));
    }, err =>{
      console.log(err);  
    });  
  }

}
