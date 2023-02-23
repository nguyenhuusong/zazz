import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BangLuongComponent } from 'src/app/components/luong-thue/bang-luong/bang-luong.component';
import { ChiTietBangLuongComponent } from 'src/app/components/luong-thue/bang-luong/chi-tiet-bang-luong/chi-tiet-bang-luong.component';
import { TinhLuongComponent } from 'src/app/components/luong-thue/tinh-luong/tinh-luong.component';
import { CauTrucBangLuongComponent } from 'src/app/components/luong-thue/bang-luong/cau-truc-bang-luong/cau-truc-bang-luong.component';
import { CongThucLuongComponent } from 'src/app/components/luong-thue/bang-luong/cong-thuc-luong/cong-thuc-luong.component';
import { ImportCapBacLuongComponent } from 'src/app/components/luong-thue/tinh-luong/import-cap-bac-luong/import-cap-bac-luong.component';
import { ImportExcelComponent } from 'src/app/common/import-excel/import-excel.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "danh-sach-bang-luong",
    pathMatch: 'full'
  },
  {
    path: 'danh-sach-bang-luong',
    component: BangLuongComponent,
    data: {
      title: 'Danh sách bảng lương',
      url: 'danh-sach-bang-luong',
    },
  },
  {
    path: 'tinh-luong',
    component: TinhLuongComponent,
    data: {
      title: 'Thiết lập tham số',
      url: 'thiet-lap-tham-so',
    },
  },
  {
    path: 'tinh-luong/import-cap-bac-luong',
    component: ImportExcelComponent,
    data: {
      title: 'Import cấp bậc lương',
      url: 'import-cap-bac-luong',
      titleDad : 'Danh sách tính lương',
      urlDad: '/luong-thue/tinh-luong',
      api: 'setPayrollBaseImport',
      apiAccept: 'setPayrollBaseAccept',
      fileDoc: 'DM_CapBacLuong_Import.xls',
      apiExport: 'setPayrollBaseExportDraft'
    },
  },
  {
    path: 'tinh-luong/import-thanh-phan-luong',
    component: ImportExcelComponent,
    data: {
      title: 'Import Thành phần lương',
      url: 'import-cap-thanh-phan-luong',
      titleDad : 'Danh sách tính lương',
      urlDad: '/luong-thue/tinh-luong',
      api: 'setPayrollBaseImport',
      apiAccept: 'setPayrollBaseAccept',
      fileDoc: 'DM_ThanhPhanLuong_Import.xls',
      apiExport: ''
    },
  },
  {
    path: 'danh-sach-bang-luong/chi-tiet-bang-luong',
    component: ChiTietBangLuongComponent,
    data: {
      title: 'Chi tiết bảng lương',
      url: 'chi-tiet-bang-luong',
    },
  },
  {
    path: 'danh-sach-bang-luong/cau-truc-bang-luong',
    component: CauTrucBangLuongComponent,
    data: {
      title: 'Chi tiết bảng lương',
      url: 'chi-tiet-bang-luong',
    },
  },
  {
    path: 'danh-sach-bang-luong/cong-thuc-luong',
    component: CongThucLuongComponent,
    data: {
      title: 'Chi tiết bảng lương',
      url: 'chi-tiet-bang-luong',
    },
  },

  
  ,

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LuongThueRoutingModule { }