import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PqQuyenNguoiDungComponent } from 'src/app/components/pq-quyen-nguoi-dung/pq-quyen-nguoi-dung.component';
import { PqThangMayComponent } from 'src/app/components/pq-thang-may/pq-thang-may.component';
import { PqTheNhanVienComponent } from 'src/app/components/pq-the-nhan-vien/pq-the-nhan-vien.component';
import { PqXeNhanVienComponent } from 'src/app/components/pq-xe-nhan-vien/pq-xe-nhan-vien.component';
import { ThietBiThangMayComponent } from 'src/app/components/thiet-bi-thang-may/thiet-bi-thang-may.component';
import { ThietLapTangThangMayComponent } from 'src/app/components/thiet-lap-tang-thang-may/thiet-lap-tang-thang-may.component';
import { ChiTietTheNhanVienComponent } from 'src/app/components/pq-the-nhan-vien/chi-tiet-the-nhan-vien/chi-tiet-the-nhan-vien.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "thong-bao",
    pathMatch: 'full'
  },
  //Quyền thang máy
  {
    path: 'phan-quyen-thang-may',
    component: PqThangMayComponent,
    data: {
      title: 'Phân quyền thang máy',
      url: 'phan-quyen-thang-may',
    },
  },
  //Quyền thang máy
  {
    path: 'the-nhan-vien',
    component: PqTheNhanVienComponent,
    data: {
      title: 'Danh sách thẻ nhân viên',
      url: 'the-nhan-vien',
    },
  },
  // thêm mới thẻ nhân viên
  {
    path: 'the-nhan-vien/them-moi-the-nhan-vien',
    component: ChiTietTheNhanVienComponent,
    data: {
      title: 'Thêm mới thẻ nhân viên',
      url: 'them-moi-nhan-vien',
    },
  },
  //Thiết bị thang máy
  {
    path: 'thiet-bi-thang-may',
    component: ThietBiThangMayComponent,
    data: {
      title: 'Danh sách thẻ nhân viên',
      url: 'thiet-bi-thang-may',
    },
  },
  //Thiết bị thang máy
  {
    path: 'thiet-lap-tang-thang-may',
    component: ThietLapTangThangMayComponent,
    data: {
      title: 'Danh sách thiết lập tầng thang máy',
      url: 'thiet-lap-tang-thang-may',
    },
  },
  //Quyền thang máy
  {
    path: 'xe-nhan-vien',
    component: PqXeNhanVienComponent,
    data: {
      title: 'Danh sách xe nhân viên',
      url: 'xe-nhan-vien',
    },
  },
  //Quyền người dùng
  {
    path: 'quyen-nguoi-dung',
    component: PqQuyenNguoiDungComponent,
    data: {
      title: 'Danh sách quyền người dùng',
      url: 'quyen-nguoi-dung',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhanQuyenRoutingModule { }