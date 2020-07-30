import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';


import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { ManUpModule } from 'ionic-manup';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LocationTrackerService } from './services/location-tracker.service';
import { PluginService } from './services/plugin.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    HttpClientModule,
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot({
      name: '__kquality_db'}),
    ManUpModule.forRoot({ url: 'https://www.utravy.com/webapi/home/latestversion' }), 
    AppRoutingModule
  ],
  providers: [
    AppVersion,
    InAppBrowser,
    Network,
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    AndroidPermissions,
    BackgroundGeolocation,
    LocationAccuracy,
    Geolocation,
    Diagnostic,    
    PluginService,
    LocationTrackerService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
