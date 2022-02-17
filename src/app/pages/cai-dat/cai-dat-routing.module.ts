import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CaiDatLichHopComponent } from 'src/app/components/cai-dat-lich-hop/cai-dat-lich-hop.component';
import { CaiDatToChucComponent } from 'src/app/components/cai-dat-to-chuc/cai-dat-to-chuc.component';
import { CaiDatCongTyComponent } from 'src/app/components/cai-dat-cong-ty/cai-dat-cong-ty.component';
import { CaiDatNgayNghiLeComponent } from 'src/app/components/cai-dat-ngay-nghi-le/cai-dat-ngay-nghi-le.component';
import { ChiTietLichHopComponent } from 'src/app/components/cai-dat-lich-hop/chi-tiet-lich-hop/chi-tiet-lich-hop.component';
import { DanhSachPhongHopComponent } from 'src/app/components/cai-dat-lich-hop/danh-sach-phong-hop/danh-sach-phong-hop.component';
import { ChiTietPhongHopComponent } from 'src/app/components/cai-dat-lich-hop/danh-sach-phong-hop/chi-tiet-phong-hop/chi-tiet-phong-hop.component';
import { ChiTietToChucComponent } from 'src/app/components/cai-dat-to-chuc/chi-tiet-to-chuc/chi-tiet-to-chuc.component';
import { ChucVuComponent } from 'src/app/components/cai-dat-to-chuc/chuc-vu/chuc-vu.component';
import { NoiLamViecComponent } from 'src/app/components/cai-dat-to-chuc/noi-lam-viec/noi-lam-viec.component';
import { CaiDatThamSoComponent } from 'src/app/components/cai-dat-to-chuc/cai-dat-tham-so/cai-dat-tham-so.component';
import { LichLamViecComponent } from 'src/app/components/cai-dat-to-chuc/lich-lam-viec/lich-lam-viec.component';
import { ChiTietChucVuComponent } from 'src/app/components/cai-dat-to-chuc/chuc-vu/chi-tiet-chuc-vu/chi-tiet-chuc-vu.component';
import { ChiTietNoiLamViecComponent } from 'src/app/components/cai-dat-to-chuc/noi-lam-viec/chi-tiet-noi-lam-viec/chi-tiet-noi-lam-viec.component';
import { ChiTietLichLamViecComponent } from 'src/app/components/cai-dat-to-chuc/lich-lam-viec/chi-tiet-lich-lam-viec/chi-tiet-lich-lam-viec.component';
import { ChiTietCongTyComponent } from 'src/app/components/cai-dat-cong-ty/chi-tiet-cong-ty/chi-tiet-cong-ty.component';
import { QuanLyHopDongComponent } from 'src/app/components/quan-ly-hop-dong/quan-ly-hop-dong.component';
import { ChiTietHopDongComponent } from 'src/app/components/quan-ly-hop-dong/chi-tiet-hop-dong/chi-tiet-hop-dong.component';
import { GopYKienComponent } from 'src/app/components/gop-y-kien/gop-y-kien.component';
import { ChiTietGopYComponent } from 'src/app/components/gop-y-kien/chi-tiet-gop-y/chi-tiet-gop-y.component';

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
      title: 'Danh sachs thông báo',
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

  // cài đặt Tổ chức
  {
    path: 'cai-dat-to-chuc',
    component: CaiDatToChucComponent,
    data: {
      title: 'Danh sách quản lý tổ chức',
      url: 'cai-dat-to-chuc',
    },
  },
  {
    path: 'cai-dat-to-chuc/chi-tiet-to-chuc',
    component: ChiTietToChucComponent,
    data: {
      title: 'Chi tiết tổ chức',
      url: 'chi-tiet-to-chuc',
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
  {
    path: 'cai-dat-cong-ty/them-moi-cong-ty',
    component: ChiTietCongTyComponent,
    data: {
      title: 'Danh sách công ty',
      url: 'them-moi-cong-ty',
    },
  },
  {
    path: 'cai-dat-cong-ty/chi-tiet-cong-ty',
    component: ChiTietCongTyComponent,
    data: {
      title: 'Danh sách công ty',
      url: 'chi-tiet-cong-ty',
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

  // Cài đặt chức vụ
  {
    path: 'chuc-vu',
    component: ChucVuComponent,
    data: {
      title: 'Danh sách chức vụ',
      url: 'chuc-vu',
    },
  },
  {
    path: 'chuc-vu/them-moi-chuc-vu',
    component: ChiTietChucVuComponent,
    data: {
      title: 'Thêm mới chức vụ',
      url: 'them-moi-chuc-vu',
    },
  },
  {
    path: 'chuc-vu/chi-tiet-chuc-vu',
    component: ChiTietChucVuComponent,
    data: {
      title: 'Chi tiết chức vụ',
      url: 'chi-tiet-chuc-vu',
    },
  },

  // Cài đặt nơi làm việc
  {
    path: 'noi-lam-viec',
    component: NoiLamViecComponent,
    data: {
      title: 'Danh sách nơi làm việc',
      url: 'noi-lam-viec',
    },
  },
  {
    path: 'noi-lam-viec/them-moi-noi-lam-viec',
    component: ChiTietNoiLamViecComponent,
    data: {
      title: 'Thêm mới nơi làm việc',
      url: 'them-moi-noi-lam-viec',
    },
  },
  {
    path: 'noi-lam-viec/chi-tiet-noi-lam-viec',
    component: ChiTietNoiLamViecComponent,
    data: {
      title: 'Chi tiết nơi làm việc',
      url: 'chi-tiet-noi-lam-viec',
    },
  },

   // Cài đặt tham so
   {
    path: 'cai-dat-tham-so',
    component: CaiDatThamSoComponent,
    data: {
      title: 'Cài đặt tham số',
      url: 'cai-dat-tham-so',
    },
  },

  // Cài đặt nơi làm việc
  {
    path: 'lich-lam-viec',
    component: LichLamViecComponent,
    data: {
      title: 'Danh sách lịch làm việc',
      url: 'lich-lam-viec',
    },
  },
  {
    path: 'lich-lam-viec/them-moi-lich-lam-viec',
    component: ChiTietLichLamViecComponent,
    data: {
      title: 'Thêm mới lịch làm việc',
      url: 'them-moi-lich-lam-viec',
    },
  },
  {
    path: 'lich-lam-viec/chi-tiet-lich-lam-viec',
    component: ChiTietLichLamViecComponent,
    data: {
      title: 'Chi tiết lịch làm việc',
      url: 'lich-lam-viec/chi-tiet-lich-lam-viec',
    },
  },

  // Quản lý hợp đồng 

  {
    path: 'quan-ly-hop-dong',
    component: QuanLyHopDongComponent,
    data: {
      title: 'Danh sách quản lý hợp đồng',
      url: 'quan-ly-hop-dong',
    },
  },
  {
    path: 'quan-ly-hop-dong/them-moi-hop-dong',
    component: ChiTietHopDongComponent,
    data: {
      title: 'Thêm mới hợp đồng',
      url: 'them-moi-hop-dong',
    },
  },
  {
    path: 'quan-ly-hop-dong/chi-tiet-hop-dong',
    component: ChiTietHopDongComponent,
    data: {
      title: 'Chi tiết hợp đồng',
      url: 'chi-tiet-hop-dong',
    },
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaiDatRoutingModule { }