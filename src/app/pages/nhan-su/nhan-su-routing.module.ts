import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NsTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/ns-tuyen-dung.component';
import { ViTriTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/vi-tri-tuyen-dung/vi-tri-tuyen-dung.component';
import { ThongTinLinhVucTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/thong-tin-linh-vuc-tuyen-dung/thong-tin-linh-vuc-tuyen-dung.component';
import { ChiTietViTriTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chi-tiet-vi-tri-tuyen-dung/chi-tiet-vi-tri-tuyen-dung.component';

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
    component: NsTuyenDungComponent,
    data: {
      title: 'Thêm mới tuyển dụng',
      url: 'them-moi-tuyen-dung',
    },
  },
  {
    path: 'tuyen-dung/chi-tiet-tuyen-dung',
    component: NsTuyenDungComponent,
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
//lĩnh vực
  {
    path: 'tuyen-dung/linh-vuc-tuyen-dung',
    component: ViTriTuyenDungComponent,
    data: {
      title: 'Danh sách lĩnh vực tuyển dụng',
      url: 'linh-vuc-tuyen-dung',
    },
  },
  {
    path: 'tuyen-dung/linh-vuc-tuyen-dung/them-moi-linh-vuc-tuyen-dung',
    component: ThongTinLinhVucTuyenDungComponent,
    data: {
      title: 'Thêm mới lĩnh vực tuyển dụng',
      url: 'them-moi-linh-vuc-tuyen-dung',
    },
  },
  {
    path: 'tuyen-dung/linh-vuc-tuyen-dung/chi-tiet-linh-vuc-tuyen-dung',
    component: ThongTinLinhVucTuyenDungComponent,
    data: {
      title: 'Chi tiết lĩnh vực tuyển dụng',
      url: 'chi-tiet-linh-vuc-tuyen-dung',
    },
  },

  //hồ sơ nhân sự
  {
    path: 'ho-so-nhan-su',
    component: NsTuyenDungComponent,
    data: {
      title: 'Danh sách hồ sơ nhân sự',
      url: 'ho-so-nhan-su',
    },
  },

   //hồ sơ nghỉ việc
   {
    path: 'ho-so-nghi-viec',
    component: NsTuyenDungComponent,
    data: {
      title: 'Danh sách hồ sơ nghỉ việc',
      url: 'ho-so-nghi-viec',
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NhanSuRoutingModule { }