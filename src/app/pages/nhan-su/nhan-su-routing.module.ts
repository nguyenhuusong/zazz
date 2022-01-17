import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NsTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/ns-tuyen-dung.component';
import { ViTriTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/vi-tri-tuyen-dung/vi-tri-tuyen-dung.component';
import { ChiTietViTriTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chi-tiet-vi-tri-tuyen-dung/chi-tiet-vi-tri-tuyen-dung.component';
import { ChiTietLinhVucTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chi-tiet-linh-vuc-tuyen-dung/chi-tiet-linh-vuc-tuyen-dung.component';
import { ChiTietTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chi-tiet-tuyen-dung/chi-tiet-tuyen-dung.component';
import { NsHoSoNghiViecComponent } from 'src/app/components/ns-ho-so-nghi-viec/ns-ho-so-nghi-viec.component';
import { NsHoSoNhanSuComponent } from 'src/app/components/ns-ho-so-nhan-su/ns-ho-so-nhan-su.component';
import { ChiTietHoSoNhanSuComponent } from 'src/app/components/ns-ho-so-nhan-su/chi-tiet-ho-so-nhan-su/chi-tiet-ho-so-nhan-su.component';
import { ChiTietHoSoNghiViecComponent } from 'src/app/components/ns-ho-so-nghi-viec/chi-tiet-ho-so-nghi-viec/chi-tiet-ho-so-nghi-viec.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "tuyen-dung",
    pathMatch: 'full'
  },
  //Tuyển dụng
  {
    path: 'tuyen-dung',
    component: NsTuyenDungComponent,
    data: {
      title: 'Danh sách tuyển dụng',
      url: 'tuyen-dung',
    },
  },
  {
    path: 'tuyen-dung/them-moi-tuyen-dung',
    component: ChiTietTuyenDungComponent,
    data: {
      title: 'Thêm mới tuyển dụng',
      url: 'them-moi-tuyen-dung',
    },
  },
  {
    path: 'tuyen-dung/chi-tiet-tuyen-dung',
    component: ChiTietTuyenDungComponent,
    data: {
      title: 'Chi tiết tuyển dụng tuyển dụng',
      url: 'chi-tiet-tuyen-dung',
    },
  },
  {
    path: 'tuyen-dung/vi-tri-tuyen-dung',
    component: ViTriTuyenDungComponent,
    data: {
      title: 'Danh sách vị trí tuyển dụng',
      url: 'vi-tri-tuyen-dung',
    },
  },
  {
    path: 'tuyen-dung/vi-tri-tuyen-dung/them-moi-vi-tri-tuyen-dung',
    component: ChiTietViTriTuyenDungComponent,
    data: {
      title: 'Thêm mới vị trí tuyển dụng',
      url: 'them-moi-vi-tri-tuyen-dung',
    },
  },
  {
    path: 'tuyen-dung/vi-tri-tuyen-dung/chi-tiet-vi-tri-tuyen-dung',
    component: ChiTietViTriTuyenDungComponent,
    data: {
      title: 'Chi tiết vị trí tuyển dụng',
      url: 'chi-tiet-vi-tri-tuyen-dung',
    },
  },
//Chuyên môn
  {
    path: 'tuyen-dung/linh-vuc-tuyen-dung',
    component: ViTriTuyenDungComponent,
    data: {
      title: 'Danh sách Chuyên môn tuyển dụng',
      url: 'linh-vuc-tuyen-dung',
    },
  },
  {
    path: 'tuyen-dung/linh-vuc-tuyen-dung/them-moi-linh-vuc-tuyen-dung',
    component: ChiTietLinhVucTuyenDungComponent,
    data: {
      title: 'Thêm mới Chuyên môn tuyển dụng',
      url: 'them-moi-linh-vuc-tuyen-dung',
    },
  },
  {
    path: 'tuyen-dung/linh-vuc-tuyen-dung/chi-tiet-linh-vuc-tuyen-dung',
    component: ChiTietLinhVucTuyenDungComponent,
    data: {
      title: 'Chi tiết Chuyên môn tuyển dụng',
      url: 'chi-tiet-linh-vuc-tuyen-dung',
    },
  },

  //hồ sơ nhân sự
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

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NhanSuRoutingModule { }




