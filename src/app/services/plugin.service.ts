import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

import { ToastController } from '@ionic/angular';

import { reject } from 'q';

@Injectable()
export class PluginService {

  options: GeolocationOptions;
  currentPos: Geoposition;
  subscription: any;
  locationCoords: any;
  apiResponse: any;
  constructor(    
    private toastCtrl: ToastController,
    private diagnostic: Diagnostic,
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy
  ) {
   this.locationCoords = {
       latitude: "",
       longitude: "",
       accuracy: "",
       timestamp: ""
    }
  }
  //To check whether Location Service is enabled or Not
  async locationStatus() {
    return new Promise((resolve, reject) => {
      this.diagnostic.isLocationEnabled().then((isEnabled) => {
        console.log('line 38', isEnabled);
        if (isEnabled === false) {
            resolve(false);
        }else if (isEnabled === true) {
            resolve(true);
        }
      })
      .catch((e) => {        
        reject(false);
      });
    });
  }
  async checkLocationEnabled() {
    return new Promise((resolve, reject) => {
      this.diagnostic.isLocationEnabled().then((isEnabled) => {
          console.log('checkLocationEnabled '+ isEnabled);
          if (isEnabled === false) {
            this.showToast('Please turn on Location Service');
            resolve(false);
          } else if (isEnabled === true) {
              this.checkGPSPermission().then((response) => {
              console.log(response, 'checkGPSPermission-checkLocationEnabled');
              this.apiResponse = response;
              if(this.apiResponse === false) {
                reject(false);
              } else {
                resolve(this.apiResponse);
              }
            })
            .catch((e) => {
              console.log(e, 'checkGPSPermission-checkLocationEnabled');
              reject(false);
          });
        }
      })
      .catch((e) => {
        this.showToast('Please turn on Location');
        reject(false);
      });
    });
  }
  //Check if application having GPS access permission
  async checkGPSPermission() {
    return new Promise((resolve, reject) => {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
          result => {
            console.log("check GPS Permission "+ result.hasPermission);
            resolve(result.hasPermission);            
          },err => {
            console.log(err);
            reject(false);
          });
    });
  }
  async askToTurnOnGPS() {
    return new Promise((resolve, reject) => {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then((resp) => {
        console.log(resp, 'location accuracy');
        // When GPS Turned ON call method to get Accurate location coordinates                
        this.getLocationCoordinates().then((cords) => {
          console.log(cords, 'coordinates');
          this.apiResponse = cords;
          if(this.apiResponse === false) {
            reject(false);
          }else {
            resolve(this.apiResponse);
          }
        });
        error => {
          console.log('Error requesting location permissions');
          reject(false);
        }
      });
    });
  }
  async getLocationCoordinates() {
    return new Promise((resolve, reject) => {
      this.options = {
        maximumAge: 3000,
        enableHighAccuracy: true
      };
      this.geolocation.getCurrentPosition(this.options).then((resp) => {        
        this.locationCoords.latitude = resp.coords.latitude;
        this.locationCoords.longitude = resp.coords.longitude;
        this.locationCoords.accuracy = resp.coords.accuracy;
        this.locationCoords.timestamp = resp.timestamp;        
        resolve(this.locationCoords);
      }).catch((error) => {
          this.showToast('Please allow to access your device location!');
          reject(false);
      });
    });
  }
  async showToast(message:string) {
    const toast = await this.toastCtrl.create({
      message: '<img src = "./assets/images/error.png"> '+message,
      duration: 3000,    
      mode: 'ios',
      cssClass: 'custom-toast',
    });
    toast.present();    
    document.querySelector('.custom-toast').shadowRoot.querySelector('.toast-message img').setAttribute('style', 'float:left;padding-right:8px;');
    document.querySelector('.custom-toast').shadowRoot.querySelector('.toast-button-group').setAttribute('style', 'position:absolute;');
    document.querySelector('.custom-toast').shadowRoot.querySelector('.toast-button').setAttribute('style', 'min-width: 20em;');
  }  
}
