import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [  
  {
    path: '',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },  
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'allow-location',
    loadChildren: () => import('./pages/allow-location/allow-location.module').then( m => m.AllowLocationPageModule)
  },
  {
    path: 'your-order',
    loadChildren: () => import('./your-orders/your-orders.module').then( m => m.YourOrdersPageModule)
  },
  {
    path: 'offers',
    loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
  }  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
