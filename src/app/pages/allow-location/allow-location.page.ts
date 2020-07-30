import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { PluginService } from 'src/app/services/plugin.service';
import { NavController } from '@ionic/angular';

declare var google;
var _that:any;

@Component({
  selector: 'app-allow-location',
  templateUrl: './allow-location.page.html',
  styleUrls: ['./allow-location.page.scss'],
})
export class AllowLocationPage implements OnInit, AfterViewInit {
  @ViewChild('mapElement', {read: ElementRef, static: false}) mapNativeElement: ElementRef;  
  @ViewChild('autoCompleteInput', {read: ElementRef, static: false}) inputNativeElement: any;
  buttonLabel:string = 'Delecting location..';
  directionForm: FormGroup;
  deliveryAddress:string;
  deliveryCountry:string;
  addressFound:boolean = false;
  mapTypeId:boolean = true;
  
  countryRestrict = {'country': 'in'};

  currentLocation:any =  {lat: 0, lng: 0 };
  locationCoords: any;
  mapObject:any;mapDefaultMarker:any;
  icon = {
    url: 'assets/images/map-pin-pos.png', // image url
    scaledSize: new google.maps.Size(50, 50), // scaled size
  };
  mapStyle = [
    {"featureType": "administrative","elementType": "labels","stylers": [{ "visibility": "off" }]},
    {"featureType": "landscape","elementType": "labels","stylers": [{ "visibility": "off" }]},
    {"featureType": "poi","elementType": "labels","stylers": [{ "visibility": "off" }]},
    {"featureType": "transit","elementType": "all","stylers": [{ "visibility": "off" }]},
    {"featureType": "water","elementType": "labels","stylers": [{ "visibility": "off" }]},
    {"featureType": "road","elementType": "labels","stylers": [{ "visibility": "off" }]},
    {"elementType": "geometry", "stylers": [{"color": "#f5f5f5"}]},
    {"elementType": "labels.icon","stylers": [{"visibility": "off" }]},
    {"elementType": "labels.text.fill","stylers": [{"color": "#616161"}]},
    {"elementType": "labels.text.stroke","stylers": [{"color": "#f5f5f5"}]},
    {"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"saturation": 100}, {"weight": 8}]},
    {"featureType": "administrative","elementType": "labels.text.fill","stylers": [{"color": "#444444"}]},
    {"featureType": "administrative","elementType": "labels.text.stroke","stylers": [{"color": "#ffffff"},{"weight": 3}]},
    {"featureType": "administrative.country","elementType": "geometry.stroke","stylers": [{"visibility": "off"}]},
    {"featureType": "administrative.land_parcel","elementType": "labels.text.fill","stylers": [{"color": "#bdbdbd"}]},
    {"featureType": "administrative.province","elementType": "geometry.stroke","stylers": [{"visibility": "off"}]},
    {"featureType": "landscape.man_made","elementType": "geometry.fill","stylers": [{"color": "#eceaf0"}]},
    {"featureType": "landscape.natural","elementType": "geometry.fill","stylers": [{"color": "#eceaf0"}]},
    {"featureType": "landscape.natural","elementType": "labels.text.fill","stylers": [{"color": "#37610c"}]},
    {"featureType": "poi","elementType": "geometry","stylers": [{"color": "#eeeeee"}]},
    {"featureType": "poi","elementType": "labels.text.fill","stylers": [{"color": "#757575"}]},
    {"featureType": "poi.business","stylers": [{"visibility": "off"}]},
    {"featureType": "poi.park","elementType": "geometry","stylers": [{"color": "#e5e5e5"}]},
    {"featureType": "poi.park","elementType": "geometry.fill","stylers": [{"color": "#dfe9e7"}]},
    {"featureType": "poi.park","elementType": "labels.text.fill","stylers": [{"color": "#227021"}]},
    {"featureType": "poi.park","elementType": "labels.text.stroke","stylers": [{"color": "#ffffff"}]},
    {"featureType": "road","elementType": "geometry","stylers": [{"color": "#ffffff"}]},
    {"featureType": "road","elementType": "labels.icon","stylers": [{"visibility": "off"}]},
    {"featureType": "road.arterial","elementType": "labels.text.fill","stylers": [{"color": "#757575"}]},
    {"featureType": "road.highway","elementType": "geometry","stylers": [{"color": "#dadada"}]},
    {"featureType": "road.highway","elementType": "geometry.fill","stylers": [{"color": "#ffffff"}]},
    {"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{"visibility": "off"}]},
    {"featureType": "road.highway","elementType": "labels.text.fill","stylers": [{"color": "#616161"}]},
    {"featureType": "road.local","elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]},
    {"featureType": "transit","stylers": [{"visibility": "off"}]},
    {"featureType": "transit.line","elementType": "geometry","stylers": [{"color": "#e5e5e5"}]},
    {"featureType": "transit.station","elementType": "geometry","stylers": [{"color": "#eeeeee"}]},
    {"featureType": "water","elementType": "geometry","stylers": [{"color": "#c9c9c9"}]},
    {"featureType": "water","elementType": "geometry.fill","stylers": [{"color": "#beb3fa"}]},
    {"featureType": "water","elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]},
    {"featureType": "water","elementType": "labels.text.stroke","stylers": [{"visibility": "off"}]},
    {"featureType": "poi","stylers": [{ "visibility": "off" }]},
    {"featureType": "transit","elementType": "labels.icon","stylers": [{ "visibility": "off" }]}
  ]    
  mapOptions = {
    zoom: 17,
    disableDefaultUI: true,
    draggable: true,      
    center: new google.maps.LatLng(-17.824858, 31.053028),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    gestureHandling: 'greedy',
    mapTypeControl: false,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.LEFT_CENTER
    },
    panControl: true,
    panControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoomControl: false,   
    scrollwheel: true,
    scaleControl: false,
    scaleControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
    },
    streetViewControl: false,
    streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
    },
    styles: [this.mapStyle]
  };
  constructor(
    private zone: NgZone,     
    private navCtrl: NavController,
    private formBuilder: FormBuilder,    
    private storage: Storage,
    private gpsService: PluginService,
    ) {
    _that = this
    this.directionForm = this.formBuilder.group({
      placeName: [''],
    });
  }
  ngOnInit() {
  }   
  ngAfterViewInit(): void {
    this.mapObject = new google.maps.Map(this.mapNativeElement.nativeElement, this.mapOptions);   
    this.currentNavigation();      
    const autocomplete = new google.maps.places.Autocomplete(
      this.inputNativeElement.nativeElement as HTMLInputElement, 
      {
        types: ['geocode'], 
        componentRestrictions: this.countryRestrict
      });
    autocomplete.addListener('place_changed', () => {      
      const place = autocomplete.getPlace();
      console.log(place);

      _that.currentLocation.lat = place.geometry.location.lat();
      _that.currentLocation.lng = place.geometry.location.lng();     
      if (!place.geometry) {return;}
      _that.mapDefaultMarker.setMap(null);
      _that.mapDefaultMarker = new google.maps.Marker({
        position: _that.currentLocation,
        map: _that.mapObject,         
        icon: _that.icon,      
      });     
      _that.mapDefaultMarker.setPosition(place.geometry.location);
      _that.mapDefaultMarker.setVisible(true);     
      if (place.geometry.viewport) {
        this.mapObject.fitBounds(place.geometry.viewport);
      } else {
        this.mapObject.setCenter(place.geometry.location);
        this.mapObject.setZoom(17);  // Why 17? Because it looks good.
      }               
      _that.deliveryAddress = place.formatted_address;
      _that.deliveryCountry = place.name;  
      _that.addressFound = true;      
      _that.buttonLabel = 'Deliver here.';                      
      const infowindow = new google.maps.InfoWindow({
        content: '<div class="infowindow-content">' +       
                    '<img src="https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png" width="16" height="16" class="place-icon">'+
                    '<h6 class="place-name">'+_that.deliveryCountry+'</h6>' +
                    '<span class="place-address">'+_that.deliveryAddress+'</span>'+
                  '</div>',
        maxWidth: 400
      });
      infowindow.open(_that.mapObject, _that.mapDefaultMarker);
      _that.mapDefaultMarker.addListener('click', function() {
          infowindow.open(_that.mapObject, _that.mapDefaultMarker);
      });                            
      console.log(_that.deliveryCountry, _that.deliveryAddress);      
      _that.addressFound = true;
      _that.buttonLabel = 'Deliver here.';
    });      
   this.mapObject.addListener('dragend', function () {
      console.log(this);          
      _that.mapDefaultMarker.setMap(null);
      console.log(_that.mapObject);
      _that.currentLocation = {lat: _that.mapObject.center.lat(), lng: _that.mapObject.center.lng()};                         
      _that.geoCoderFunction();
    });
    this.mapObject.addListener('click', function (event) {     
      _that.mapDefaultMarker.setMap(null);    
      _that.currentLocation = {lat: event.latLng.lat(), lng: event.latLng.lng()};
      _that.geoCoderFunction(this.currentLocation);    
    });
  }
  private geoCoderFunction(){
    this.addressFound = false;      
    this.buttonLabel = 'Delecting location..';
    console.log(this.currentLocation);
    if(this.mapDefaultMarker){this.mapDefaultMarker.setMap(null);}
    this.mapDefaultMarker = new google.maps.Marker({
      position: this.currentLocation,
      map: this.mapObject,         
      icon: this.icon,      
    });     
    this.mapObject.setCenter(this.currentLocation);    
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: this.currentLocation }, function(results, status) {
      if (status === "OK") {
        if (results[0]) {             
          console.log(results);
          //var lastLength = Number(results.length - 1);
          _that.animateMapZoomTo(_that.mapObject, 17);        
          _that.deliveryCountry =  results[0]["address_components"][0]["long_name"];  
          if(_that.deliveryCountry.indexOf('Unnamed') == -1){
            _that.deliveryAddress = results[0].formatted_address;
            _that.addressFound = true;      
            _that.buttonLabel = 'Deliver here.';                      
            const infowindow = new google.maps.InfoWindow({
              content: '<div class="infowindow-content">' +       
                          '<img src="https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png" width="16" height="16" class="place-icon">'+
                          '<h6 class="place-name">'+_that.deliveryCountry+'</h6>' +                
                          '<span class="place-address">'+_that.deliveryAddress+'</span>'+
                        '</div>',
              maxWidth: 400
            });
            infowindow.open(_that.mapObject, _that.mapDefaultMarker);
            _that.mapDefaultMarker.addListener('click', function() {
                infowindow.open(_that.mapObject, _that.mapDefaultMarker);
            });                            
          }else{
            _that.addressFound = false;      
            _that.buttonLabel = "Sorry we don't delever here";
          }
          console.log(_that.deliveryCountry, _that.deliveryAddress);
        } 
      }else{
        console.log("Geocoder failed due to: " + status);        
          _that.addressFound = false;      
          _that.buttonLabel = "Sorry we don't delever here";
      }
    });  
  }
  public currentNavigation(){
    this.zone.run(() => {
      this.gpsService.getLocationCoordinates().then(async (resp:any) =>{
        console.log(resp);                    
        this.locationCoords = resp;       
        this.currentLocation = {lat: resp.latitude, lng: resp.longitude};
        this.geoCoderFunction();      
      });    
    });
  }
  public animateMapZoomTo(map, targetZoom) {
    console.log('Zoom')
    let currentZoom = arguments[2] || map.getZoom();
    if (currentZoom != targetZoom) {
        google.maps.event.addListenerOnce(map, 'zoom_changed', function () {
           _that.animateMapZoomTo(map, targetZoom, currentZoom + (targetZoom > currentZoom ? 1 : -1));
        });
        setTimeout(()=> { 
          map.setZoom(currentZoom)
        }, 80);
    }
  }
  public changeMapstyle(){    
    this.mapTypeId = !this.mapTypeId;
    if(this.mapTypeId){
      this.mapObject.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    }else{
      this.mapObject.setMapTypeId(google.maps.MapTypeId.HYBRID);
    }
  }
  public deliverHere(){
    this.storage.set('deliverLocation', {'latitude': this.currentLocation.lat, 'longitude': this.currentLocation.lng, 'deliveryAddress': this.deliveryAddress})
    .then(
      () => { 
            console.log('Location stored!');
            this.navCtrl.navigateRoot('/home');
      },
      error => console.error('Error storing location: ', error)
    );
  }
}
