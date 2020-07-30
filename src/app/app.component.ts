import { Component, ViewChildren, QueryList } from '@angular/core';

import { Platform, NavController, MenuController, ToastController, ActionSheetController, PopoverController, AlertController, ModalController, LoadingController, IonRouterOutlet } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { ManUpService } from 'ionic-manup';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {  
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;  
  showSplash: boolean = true;
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: 'home',
      icon: 'home'
    },
    {
      title: 'Your orders',
      url: 'your-order',
      icon: 'newspaper'
    },
    {
      title: 'Offers',
      url: 'home',
      icon: 'pricetag'
    },
    {
      title: 'Notifications',
      url: 'home',
      icon: 'notifications'
    },
    {
      title: 'Apply Promo Code',
      url: 'home',
      icon: 'duplicate'
    },
    {
      title: 'Settings',
      url: 'home',
      icon: 'settings'
    },
    {
      title: 'Get help',
      url: 'home',
      icon: 'call'
    },
    {
      title: 'About',
      url: 'home',
      icon: 'information-circle'
    },
    {
      title: 'Log Out',
      url: 'home',
      icon: 'log-out'
    }
  ];  
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  constructor(
    private platform: Platform,
    private router: Router,
    private screenOrientation: ScreenOrientation,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private manup: ManUpService,

    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController
  ) {
    this.initializeApp();
  }
  ngOnInit() {
    const path = window.location.pathname.split('/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());      
    }
  }
  initializeApp() {
    this.platform.ready().then(() => {
      if(this.platform.is("cordova")){
        this.manup.validate().then((val) => {
          // app initialisation
          console.log(this.manup);
          console.log('Manup works!');
        });
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.splashScreen.hide();        
        this.statusBar.styleLightContent(); 
        this.statusBar.backgroundColorByHexString("#d35400");      
        this.screenOrientation.lock('portrait');
        this.backButtonEvent();
      }
      timer(3000).subscribe(() => {
        this.showSplash = false;
        this.showToast('Due to current circumstances your order may be slightly delayed');        
      });
    });
  }
  async menuWillOpen(){
    try {const element = await this.actionSheetCtrl.getTop();if (element) {element.dismiss(); return; } } catch (error) {console.log(error); }
    try {const element = await this.popoverCtrl.getTop();if (element) {element.dismiss(); return; } } catch (error) {console.log(error); }    
    try {const element = await this.alertCtrl.getTop();if (element) {element.dismiss(); return; } } catch (error) {console.log(error); }
    try {const element = await this.modalCtrl.getTop();if (element) {element.dismiss(); return; } } catch (error) {console.log(error); }
  }
  private backButtonEvent(){        
    this.platform.backButton.subscribeWithPriority(10, async() => {
      try {const element = await this.actionSheetCtrl.getTop();if (element) {element.dismiss(); return; } } catch (error) {console.log(error); }
      try {const element = await this.popoverCtrl.getTop();if (element) {element.dismiss(); return; } } catch (error) {console.log(error); }
      try {const element = await this.menuCtrl.getOpen();if (element) {element.close(); return; } } catch (error) {console.log(error); }
      try {const element = await this.alertCtrl.getTop();if (element) {element.dismiss(); return; } } catch (error) {console.log(error); }
      try {const element = await this.modalCtrl.getTop();if (element) {element.dismiss(); return; } } catch (error) {console.log(error); }
      this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {        
        if (outlet && outlet.canGoBack()) {          
          outlet.pop();
        } else if (this.router.url === '/' 
          || this.router.url === '/home'
          || this.router.url === '/welcome'
        ) {          
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            await this.showConfirm();            
          }else{            
            const toast = await this.toastCtrl.create({
              message: "Press back again to exit app",
              duration: 3000,
              position: "bottom",
              mode: "ios"
            });
            toast.present();  
          }
          this.lastTimeBackPress = new Date().getTime();
        }
      });        
    });
  }
  ngAfterViewInit(){
    
  }
  async showConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Are you sure you want to exit the app?',
      mode: 'ios',
      buttons: [
        {text: 'Cancel',role: 'cancel',cssClass: 'secondary', handler: (blah) => {}}, 
        {text: 'Close App',handler: () => {navigator['app'].exitApp();}
      }],      
    });
    await alert.present();
  }
  async showToast(message:string) {    
    const toast = await this.toastCtrl.create({
      message: '<img style="float: left;" src = "./assets/images/megaphone.png">&nbsp;'+message,
      mode: "ios"  ,
      cssClass: 'custom-toast',
      duration: 1000,
      buttons: [
        {
          text: '',
          role: 'cancel',
          handler: () => {          
          }
        }
      ]
    });
    toast.present();
    document.querySelector('.custom-toast').shadowRoot.querySelector('.toast-message img').setAttribute('style', 'float:left;padding-right:8px;');
    document.querySelector('.custom-toast').shadowRoot.querySelector('.toast-button-group').setAttribute('style', 'position:absolute;');
    document.querySelector('.custom-toast').shadowRoot.querySelector('.toast-button').setAttribute('style', 'min-width: 20em;');
  }  
}
