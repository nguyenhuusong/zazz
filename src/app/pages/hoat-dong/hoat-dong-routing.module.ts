import { BieuMauComponent } from './../../components/bieu-mau/bieu-mau.component';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoaiBieuMauComponent } from 'src/app/components/bieu-mau/loai-bieu-mau/loai-bieu-mau.component';
import { CaiDatLichHopComponent } from 'src/app/components/cai-dat-lich-hop/cai-dat-lich-hop.component';
import { DanhSachPhongHopComponent } from 'src/app/components/cai-dat-lich-hop/danh-sach-phong-hop/danh-sach-phong-hop.component';
import { ChiTietPhongHopComponent } from 'src/app/components/cai-dat-lich-hop/danh-sach-phong-hop/chi-tiet-phong-hop/chi-tiet-phong-hop.component';
const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: 'full'
  },
  {
    path: 'tai-lieu-chung',
    component: BieuMauComponent,
    data: {
      title: 'Tài liệu chung',
      url: 'tai-lieu-chung',
    },
  },
  {
    path: 'loai-tai-lieu',
    component: LoaiBieuMauComponent,
    data: {
      title: 'Loại tài liệu',
      url: 'loai-tai-lieu',
    },
  },
  {
    path: 'lich-hop',
    component: CaiDatLichHopComponent,
    data: {
      title: 'Quản lý lịch họp',
      url: 'lich-hop',
    },
  },
  {
    path: 'lich-hop/danh-sach-phong-hop',
    component: DanhSachPhongHopComponent,
    data: {
      title: 'Phòng họp',
      url: 'danh-sach-phong-hop',
    },
  },
  {
    path: 'lich-hop/danh-sach-phong-hop/them-moi-phong-hop',
    component: ChiTietPhongHopComponent,
    data: {
      title: 'Thêm mới phòng họp',
      url: 'them-moi-phong-hop',
    },
  },
  {
    path: 'lich-hop/danh-sach-phong-hop/chi-tiet-phong-hop',
    component: ChiTietPhongHopComponent,
    data: {
      title: 'Chi tiết phòng họp',
      url: 'chi-tiet-phong-hop',
    },
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HoatDongRoutingModule { }