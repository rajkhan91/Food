import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  deleviryAddress:string = 'Select deleviry address.';
  productSegment:string = 'all products';
  gallery: any = [
    { "name": "Red Prayer Plant", "image": "/assets/images/slides/slide-1.jpg", "price": 34, "water": "150 ml", "isChecked": false, "water_duration": "1/week", "size": "small", "light": "low", "difficulty": "easy", "temrature": "16-24"},
    { "name": "Calathea Orbifolia", "image": "/assets/images/slides/slide-2.jpg", "price": 22, "water": "250 ml", "isChecked": false, "water_duration": "1/day", "size": "large", "light": "high", "difficulty": "very easy", "temrature": "17-25"},
    { "name": "Kentia Palm", "image": "/assets/images/slides/slide-3.jpg", "price": 44, "water": "500 ml", "isChecked": false, "water_duration": "1/week", "size": "medium", "light": "medium", "difficulty": "very easy", "temrature": "15-24"},
    { "name": "Bird's Nest Firm", "image": "/assets/images/slides/slide-4.jpg", "price": 23, "water": "150 ml", "isChecked": false, "water_duration": "1/week", "size": "small", "light": "medium", "difficulty": "very easy", "temrature": "16-24"},
    { "name": "Rubber Tree", "image": "/assets/images/slides/slide-5.jpg", "price": 22, "water": "300 ml", "isChecked": false, "water_duration": "1/week", "size": "medium", "light": "low", "difficulty": "easy", "temrature": "15-24"},
    { "name": "Ponytail Palm", "image": "/assets/images/slides/slide-6.jpg", "price": 44, "water": "190 ml", "isChecked": false, "water_duration": "1/day", "size": "large", "light": "low", "difficulty": "very easy", "temrature": "15-24"},
    { "name": "Golden Potos", "image": "/assets/images/slides/slide-7.jpg", "price": 23, "water": "220 ml", "isChecked": false, "water_duration": "1/week", "size": "small", "light": "medium", "difficulty": "easy", "temrature": "16-25"}
  ];  
  offers: any = [
    { "name": "Red Prayer Plant", "image": "/assets/images/offers/slide-1.jpg", "price": 34, "water": "150 ml", "isChecked": false, "water_duration": "1/week", "size": "small", "light": "low", "difficulty": "easy", "temrature": "16-24"},
    { "name": "Calathea Orbifolia", "image": "/assets/images/offers/slide-2.jpg", "price": 22, "water": "250 ml", "isChecked": false, "water_duration": "1/day", "size": "large", "light": "high", "difficulty": "very easy", "temrature": "17-25"},
    { "name": "Kentia Palm", "image": "/assets/images/offers/slide-3.jpg", "price": 44, "water": "500 ml", "isChecked": false, "water_duration": "1/week", "size": "medium", "light": "medium", "difficulty": "very easy", "temrature": "15-24"},
    { "name": "Bird's Nest Firm", "image": "/assets/images/offers/slide-4.jpg", "price": 23, "water": "150 ml", "isChecked": false, "water_duration": "1/week", "size": "small", "light": "medium", "difficulty": "very easy", "temrature": "16-24"},
    { "name": "Rubber Tree", "image": "/assets/images/offers/slide-5.jpg", "price": 22, "water": "300 ml", "isChecked": false, "water_duration": "1/week", "size": "medium", "light": "low", "difficulty": "easy", "temrature": "15-24"},    
  ];  
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoplay:true
  };
  constructor(
    public zone: NgZone,
    private storage: Storage,
  ) { 
           
  }  
  ionViewWillEnter(){
    this.storage.get('deliverLocation')
    .then(
      data => {
        console.log(data);
        this.deleviryAddress = data['deliveryAddress'];
      },
      error => {
        console.error(error); 
        this.deleviryAddress = 'Select deleviry address.';
      }
    );
    
  }
  ngOnInit() {
    
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      document.querySelectorAll('.custom-segment-button').forEach((element) => {        
        element.shadowRoot.querySelector('.button-native').setAttribute('style', 'min-width: 67px;border-radius:50%;');
      })      
    },1000);        
  }
  public productChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
  }
}
