import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NsHoSoNghiViecComponent } from 'src/app/components/ns-ho-so-nghi-viec/ns-ho-so-nghi-viec.component';
import { NsHoSoNhanSuComponent } from 'src/app/components/ns-ho-so-nhan-su/ns-ho-so-nhan-su.component';
import { ChiTietHoSoNhanSuComponent } from 'src/app/components/ns-ho-so-nhan-su/chi-tiet-ho-so-nhan-su/chi-tiet-ho-so-nhan-su.component';
import { ChiTietHoSoNghiViecComponent } from 'src/app/components/ns-ho-so-nghi-viec/chi-tiet-ho-so-nghi-viec/chi-tiet-ho-so-nghi-viec.component';
import { ThaiSanComponent } from 'src/app/components/thai-san/thai-san.component';
import { ChiTietThaiSanComponent } from 'src/app/components/thai-san/chi-tiet-thai-san/chi-tiet-thai-san.component';
import { DangKyLichLamViecComponent } from 'src/app/components/dang-ky-lich-lam-viec/dang-ky-lich-lam-viec.component';
import { ChiTietDangKyLichLamViecComponent } from 'src/app/components/dang-ky-lich-lam-viec/chi-tiet-dang-ky-lich-lam-viec/chi-tiet-dang-ky-lich-lam-viec.component';
import { XuLyHopDongComponent } from 'src/app/components/xu-ly-hop-dong/xu-ly-hop-dong.component';
import { PheDuyetComponent } from 'src/app/components/phe-duyet/phe-duyet.component';
import { ChiTietPheDuyetComponent } from 'src/app/components/phe-duyet/chi-tiet-phe-duyet/chi-tiet-phe-duyet.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "ho-so-nhan-su",
    pathMatch: 'full'
  },
 

  //hồ sơ nhân sự
  {
    path: 'xu-ly-hop-dong',
    component: XuLyHopDongComponent,
    data: {
      title: 'Danh sách xử lý hợp đồng',
      url: 'xu-ly-hop-dong',
    },
  },
  {
    path: 'ho-so-nhan-su',
    component: NsHoSoNhanSuComponent,
    data: {
      title: 'Danh sách hồ sơ nhân sự',
      url: 'ho-so-nhan-su',
    },
  },
  {
    path: 'ho-so-nhan-su/chi-tiet-ho-so-nhan-su',
    component: ChiTietHoSoNhanSuComponent,
    data: {
      title: 'Chi tiết hồ sơ nhân sự',
      url: 'chi-tiet-ho-so-nhan-su',
    },
  },

   //hồ sơ nghỉ việc
   {
    path: 'ho-so-nghi-viec',
    component: NsHoSoNghiViecComponent,
    data: {
      title: 'Danh sách hồ sơ nghỉ việc',
      url: 'ho-so-nghi-viec',
    },
  },

  {
    path: 'ho-so-nghi-viec/chi-tiet-ho-so-nghi-viec',
    component: ChiTietHoSoNghiViecComponent,
    data: {
      title: 'Chi tiết hồ sơ nghỉ việc',
      url: 'ho-so-nghi-viec/chi-tiet-ho-so-nghi-viec',
    },
  },

  // Thai sản

  {
    path: 'thai-san',
    component: ThaiSanComponent,
    data: {
      title: 'Danh sách nhân viên đăng ký thai sản',
      url: 'thai-san',
    },
  },
  {
    path: 'thai-san/them-moi-thai-san',
    component: ChiTietThaiSanComponent,
    data: {
      title: 'Thêm mới thai sản',
      url: 'thai-san/them-moi-thai-san',
    },
  },
  {
    path: 'thai-san/chi-tiet-thai-san',
    component: ChiTietThaiSanComponent,
    data: {
      title: 'Chi tiết thai sản',
      url: 'thai-san/chi-tiet-thai-san',
    },
  },

  //Đăng ký lịch làm việc

  {
    path: 'dang-ky-lich-lam-viec',
    component: DangKyLichLamViecComponent,
    data: {
      title: 'Danh sách đăng ký lịch làm việc',
      url: 'dang-ky-lich-lam-viec',
    },
  },
  {
    path: 'dang-ky-lich-lam-viec/them-moi-dang-ky-lich-lam-viec',
    component: ChiTietDangKyLichLamViecComponent,
    data: {
      title: 'Thêm mới đăng ký lịch làm việc',
      url: 'them-moi-dang-ky-lich-lam-viec',
    },
  },
  {
    path: 'dang-ky-lich-lam-viec/chi-tiet-dang-ky-lich-lam-viec',
    component: ChiTietDangKyLichLamViecComponent,
    data: {
      title: 'Chi tiết đăng ký lịch làm việc',
      url: 'chi-tiet-dang-ky-lich-lam-viec',
    },
  },

  //  Phê duyệt

  {
    path: 'phe-duyet',
    component: PheDuyetComponent,
    data: {
      title: 'Danh sách phê duyệt',
      url: 'phe-duyet',
    },
  },
  {
    path: 'phe-duyet/them-moi-phe-duyet',
    component: ChiTietPheDuyetComponent,
    data: {
      title: 'Thêm mới phê duyệt',
      url: 'them-moi-phe-duyet',
    },
  },
  {
    path: 'phe-duyet/chi-tiet-phe-duyet',
    component: ChiTietPheDuyetComponent,
    data: {
      title: 'Chi tiết phê duyệt',
      url: 'chi-tiet-phe-duyet',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NhanSuRoutingModule { }




