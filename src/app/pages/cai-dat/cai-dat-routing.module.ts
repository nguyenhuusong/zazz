import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CsChamCongComponent } from 'src/app/components/cs-cham-cong/cs-cham-cong.component';
import { ChiTietChamCongComponent } from 'src/app/components/cs-cham-cong/chi-tiet-cham-cong/chi-tiet-cham-cong.component';
import { CaiDatLichHopComponent } from 'src/app/components/cai-dat-lich-hop/cai-dat-lich-hop.component';
import { CaiDatToChucComponent } from 'src/app/components/cai-dat-to-chuc/cai-dat-to-chuc.component';
import { CaiDatCongTyComponent } from 'src/app/components/cai-dat-cong-ty/cai-dat-cong-ty.component';
import { CaiDatNgayNghiLeComponent } from 'src/app/components/cai-dat-ngay-nghi-le/cai-dat-ngay-nghi-le.component';
import { ChiTietLichHopComponent } from 'src/app/components/cai-dat-lich-hop/chi-tiet-lich-hop/chi-tiet-lich-hop.component';
import { DanhSachPhongHopComponent } from 'src/app/components/cai-dat-lich-hop/danh-sach-phong-hop/danh-sach-phong-hop.component';
import { ChiTietPhongHopComponent } from 'src/app/components/cai-dat-lich-hop/danh-sach-phong-hop/chi-tiet-phong-hop/chi-tiet-phong-hop.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "thong-bao",
    pathMatch: 'full'
  },
  //Chấm công
  {
    path: 'thong-bao',
    loadChildren: () => import('src/app/components/page-notify/page-notify.module').then(m => m.PageNotifyModule),
    data: {
      title: 'Danh sách chấm công',
      url: 'thong-bao',
    },
  },
  // cài đặt lịch họp
  {
    path: 'cai-dat-lich-hop',
    component: CaiDatLichHopComponent,
    data: {
      title: 'Danh sách quản lý lịch họp',
      url: 'cai-dat-lich-hop',
    },
  },
  {
    path: 'cai-dat-lich-hop/danh-sach-phong-hop',
    component: DanhSachPhongHopComponent,
    data: {
      title: 'danh sách phòng họp',
      url: 'danh-sach-phong-hop',
    },
  },
  {
    path: 'cai-dat-lich-hop/danh-sach-phong-hop/them-moi-phong-hop',
    component: ChiTietPhongHopComponent,
    data: {
      title: 'Thêm mới phòng họp',
      url: 'them-moi-phong-hop',
    },
  },
  {
    path: 'cai-dat-lich-hop/danh-sach-phong-hop/chi-tiet-phong-hop',
    component: ChiTietPhongHopComponent,
    data: {
      title: 'Chi tiết phòng họp',
      url: 'chi-tiet-phong-hop',
    },
  },
  {
    path: 'cai-dat-lich-hop/them-moi-lich-hop',
    component: ChiTietLichHopComponent,
    data: {
      title: 'Thêm mới lịch họp',
      url: 'them-moi-lich-hop',
    },
  },
  {
    path: 'cai-dat-lich-hop/chi-tiet-lich-hop',
    component: ChiTietLichHopComponent,
    data: {
      title: 'Chi tiết lịch họp',
      url: 'chi-tiet-lich-hop',
    },
  },

  // cài đặt lịch họp
  {
    path: 'cai-dat-to-chuc',
    component: CaiDatToChucComponent,
    data: {
      title: 'Danh sách quản lý tổ chức',
      url: 'cai-dat-to-chuc',
    },
  },
  

   // cài đặt Công ty
   {
    path: 'cai-dat-cong-ty',
    component: CaiDatCongTyComponent,
    data: {
      title: 'Danh sách công ty',
      url: 'cai-dat-cong-ty',
    },
  },

     // cài đặt ngày nghỉ lễ
     {
      path: 'cai-dat-ngay-nghi-le',
      component: CaiDatNgayNghiLeComponent,
      data: {
        title: 'Danh sách ngày nghỉ lễ',
        url: 'cai-dat-ngay-nghi-le',
      },
    },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaiDatRoutingModule { }