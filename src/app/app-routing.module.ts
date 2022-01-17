import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { DefaultLayoutComponent } from './containers';
import { HomeComponent } from './pages/home/home.component';
// import { HomeComponent } from './home/home.component';
// import { OrderSunshineComponent } from './order-sunshine/order-sunshine.component';
// import { ReportendofdayComponent } from './reportendofday/reportendofday.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'auth-callback', component: AuthCallbackComponent },

  {
    path: '', component: DefaultLayoutComponent,
    data: { title: '' }, children: [
      { path: 'home', component: HomeComponent },
      {
        path: 'nhan-su',
        loadChildren: () => import('../app/pages/nhan-su/nhan-su.module').then(m => m.NhanSuModule)
      },
      {
        path: 'chinh-sach',
        loadChildren: () => import('../app/pages/chinh-sach/chinh-sach.module').then(m => m.ChinhSachModule)
      },
      {
        path: 'cai-dat',
        loadChildren: () => import('../app/pages/cai-dat/cai-dat.module').then(m => m.CaiDatModule)
      },
      // {
      //   path: 'manager',
      //   loadChildren: () => import('../app/pages/quan-tri/quan-tri.module').then(m => m.QuanTriModule)
      // },
      // {
      //   path: 'partner',
      //   loadChildren: () => import('../app/pages/doi-tac/doi-tac.module').then(m => m.DoiTacModule)
      // },
      // {
      //   path: 'exchange',
      //   loadChildren: () => import('../app/pages/giao-dich/giao-dich.module').then(m => m.GiaoDichModule)
      // },
      // {
      //   path: 'product',
      //   loadChildren: () => import('../app/pages/hang-hoa/hang-hoa.module').then(m => m.HangHoaModule)
      // },
      // {
      //   path: 'user',
      //   loadChildren: () => import('../app/pages/nhan-vien/nhan-vien.module').then(m => m.NhanVienSieuThiModule)
      // },
      // {
      //   path: 'report',
      //   loadChildren: () => import('../app/pages/bao-cao/bao-cao.module').then(m => m.BaoCaoModule)
      // },
      
    ], canActivate: [AuthGuardService]
  },
 
  
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
