import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { DefaultLayoutComponent } from './containers';
import { HomeComponent } from './pages/home/home.component';
import { ChiTietGopYComponent } from './components/gop-y-kien/chi-tiet-gop-y/chi-tiet-gop-y.component';
import { GopYKienComponent } from './components/gop-y-kien/gop-y-kien.component';
import { UniNotFoundComponent } from './components/uni-not-found/uni-not-found.component';
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
      { path: 'uni-example', loadChildren: () => import('../app/pages/uni-example/uni-example.module').then(m => m.UniExampleModule) },
      {
        path: 'tuyen-dung',
        loadChildren: () => import('../app/pages/tuyen-dung/tuyen-dung.module').then(m => m.TuyenDungModule)
      },
      {
        path: '404',
        pathMatch: 'full',
        component: UniNotFoundComponent
      },
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
      {
        path: 'gop-y',
        loadChildren: () => import('../app/pages/gop-y/gop-y.module').then(m => m.GopYModule)
      },
      {
        path: 'phan-quyen',
        loadChildren: () => import('../app/pages/phan-quyen/phan-quyen.module').then(m => m.PhanQuyenModule)
      },
      {
        path: 'luong-thue',
        loadChildren: () => import('../app/pages/luong-thue/luong-thue.module').then(m => m.LuongThueModule)
      },
      {
        path: 'hoat-dong',
        loadChildren: () => import('../app/pages/hoat-dong/hoat-dong.module').then(m => m.HoatDongModule)
      },
      {
        path: 'bao-cao',
        loadChildren: () => import('../app/pages/bao-cao/bao-cao.module').then(m => m.BaoCaoModule)
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
