import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NsTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/ns-tuyen-dung.component';
import { ViTriTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/vi-tri-tuyen-dung/vi-tri-tuyen-dung.component';
import { ChiTietViTriTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chi-tiet-vi-tri-tuyen-dung/chi-tiet-vi-tri-tuyen-dung.component';
import { ChiTietLinhVucTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chi-tiet-linh-vuc-tuyen-dung/chi-tiet-linh-vuc-tuyen-dung.component';
import { ChiTietTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chi-tiet-tuyen-dung/chi-tiet-tuyen-dung.component';
import { LinhVucTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/linh-vuc-tuyen-dung/linh-vuc-tuyen-dung.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "ds-tuyen-dung",
    pathMatch: 'full'
  },
  //Tuyển dụng
  {
    path: 'ds-tuyen-dung',
    component: NsTuyenDungComponent,
    data: {
      title: 'Danh sách tuyển dụng',
      url: 'ds-tuyen-dung',
    },
  },
  {
    path: 'ds-tuyen-dung/them-moi-tuyen-dung',
    component: ChiTietTuyenDungComponent,
    data: {
      title: 'Thêm mới tuyển dụng',
      url: 'them-moi-tuyen-dung',
    },
  },
  {
    path: 'ds-tuyen-dung/chi-tiet-tuyen-dung',
    component: ChiTietTuyenDungComponent,
    data: {
      title: 'Chi tiết tuyển dụng tuyển dụng',
      url: 'chi-tiet-tuyen-dung',
    },
  },
  {
    path: 'vi-tri-tuyen-dung',
    component: ViTriTuyenDungComponent,
    data: {
      title: 'Danh sách vị trí tuyển dụng',
      url: 'vi-tri-tuyen-dung',
    },
  },
  {
    path: 'vi-tri-tuyen-dung/them-moi-vi-tri-tuyen-dung',
    component: ChiTietViTriTuyenDungComponent,
    data: {
      title: 'Thêm mới vị trí tuyển dụng',
      url: 'them-moi-vi-tri-tuyen-dung',
    },
  },
  {
    path: 'vi-tri-tuyen-dung/chi-tiet-vi-tri-tuyen-dung',
    component: ChiTietViTriTuyenDungComponent,
    data: {
      title: 'Chi tiết vị trí tuyển dụng',
      url: 'chi-tiet-vi-tri-tuyen-dung',
    },
  },
//Chuyên môn
  {
    path: 'chuyen-mon',
    component: LinhVucTuyenDungComponent,
    data: {
      title: 'Danh sách Chuyên môn tuyển dụng',
      url: 'chuyen-mon',
    },
  },
  {
    path: 'chuyen-mon/them-moi-linh-vuc-tuyen-dung',
    component: ChiTietLinhVucTuyenDungComponent,
    data: {
      title: 'Thêm mới Chuyên môn tuyển dụng',
      url: 'them-moi-linh-vuc-tuyen-dung',
    },
  },
  {
    path: 'chuyen-mon/chi-tiet-linh-vuc-tuyen-dung',
    component: ChiTietLinhVucTuyenDungComponent,
    data: {
      title: 'Chi tiết Chuyên môn tuyển dụng',
      url: 'chi-tiet-linh-vuc-tuyen-dung',
    },
  },


 


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TuyenDungRoutingModule { }




