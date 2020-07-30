import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, GeolocationOptions } from '@ionic-native/geolocation/ngx';
import { BackgroundGeolocation, BackgroundGeolocationResponse, BackgroundGeolocationConfig, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation/ngx';

@Injectable({
 providedIn: 'root'
})
export class LocationTrackerService {
  
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  options: GeolocationOptions;
  currentPos: Geoposition;
  time: any;

  constructor(
    public zone: NgZone,
    public backgroundGeolocation: BackgroundGeolocation,
    private geolocation: Geolocation,
  ) {}
  async startTracking() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    };
    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
        console.log('line32:', location);  
        // this.zone.run(() => {
        //   this.lat = location.latitude;
        //   this.lng = location.longitude;
        //   this.time = location.time;
        // });

        // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
        // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        this.backgroundGeolocation.finish(); // FOR IOS ONLY
      });       
    }, (err) => {
      console.log(err);
    });
    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();    
  }
  stopTracking() {   
   this.backgroundGeolocation.finish();
   this.watch.unsubscribe();
  }
}
