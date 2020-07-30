import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { PluginService } from '../services/plugin.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  
  systemSupportLocation:any;
  constructor(
    public platform: Platform,
    public route: Router,
    public navCtrl: NavController,
    public zone: NgZone,
    public gpsService:PluginService,
    protected readonly cd: ChangeDetectorRef,       
  ) {    
    if(this.platform.is("cordova")){
      this.zone.run(() => {
        this.gpsService.locationStatus().then(
          result => {
            this.systemSupportLocation = result;
            this.gpsService.checkGPSPermission().then(
              response => {
                console.log("check GPS Permission "+ response);
                if(response) {
                  this.navCtrl.navigateRoot('/home');
                }              
              });  
          });
      });   
    }else{
      this.navCtrl.navigateRoot('/home');
    }
  }  
  checkLocationPermission(){
    if(this.platform.is("cordova")){
      this.zone.run(() => {
        this.gpsService.askToTurnOnGPS().then((result) =>{
          console.log("RESULT ", result);
          if(result != null){
            this.navCtrl.navigateRoot('/home');
          }
        });  
      });
    }else{
      this.navCtrl.navigateRoot('/home');
    }
  }
}
