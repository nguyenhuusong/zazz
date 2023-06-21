import { LoaiBieuMauComponent } from './../../components/bieu-mau/loai-bieu-mau/loai-bieu-mau.component';
import { ChiTietLoaiBieuMauComponent } from '../../components/bieu-mau/loai-bieu-mau/chi-tiet-loai-bieu-mau/chi-tiet-loai-bieu-mau.component';
import { BieuMauChiTietComponent } from '../../components/bieu-mau/bieu-mau-chi-tiet/bieu-mau-chi-tiet.component';
import { BieuMauComponent } from './../../components/bieu-mau/bieu-mau.component';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CsNghiPhepComponent } from 'src/app/components/cs-nghi-phep/cs-nghi-phep.component';
import { CsChamCongComponent } from 'src/app/components/cs-cham-cong/cs-cham-cong.component';
import { CsAnCaComponent } from 'src/app/components/cs-an-ca/cs-an-ca.component';
import { CsTienLuongComponent } from 'src/app/components/cs-tien-luong/cs-tien-luong.component';
import { CsThueThuNhapComponent } from 'src/app/components/cs-thue-thu-nhap/cs-thue-thu-nhap.component';
import { ChiTietNghiPhepComponent } from 'src/app/components/cs-nghi-phep/chi-tiet-nghi-phep/chi-tiet-nghi-phep.component';
import { ChiTietAnCaComponent } from 'src/app/components/cs-an-ca/chi-tiet-an-ca/chi-tiet-an-ca.component';
import { ChiTietChamCongComponent } from 'src/app/components/cs-cham-cong/chi-tiet-cham-cong/chi-tiet-cham-cong.component';
import { ChiTietTienLuongComponent } from 'src/app/components/cs-tien-luong/chi-tiet-tien-luong/chi-tiet-tien-luong.component';
import { ChiTietThueThuNhapComponent } from 'src/app/components/cs-thue-thu-nhap/chi-tiet-thue-thu-nhap/chi-tiet-thue-thu-nhap.component';
import { PhepNamComponent } from 'src/app/components/phep-nam/phep-nam.component';
import { PhepBuComponent } from 'src/app/components/phep-bu/phep-bu.component';
import { ChiTietPhepBuComponent } from 'src/app/components/phep-bu/chi-tiet-phep-bu/chi-tiet-phep-bu.component';
import { XemCongComponent } from 'src/app/components/cs-cham-cong/xem-cong/xem-cong.component';
import { EatingListComponent } from 'src/app/components/cs-an-ca/eating-list/eating-list.component';
import { ImportPhepBuComponent } from 'src/app/components/phep-bu/import-phep-bu/import-phep-bu.component';
import { CsChamCongOverviewComponent } from 'src/app/components/cs-cham-cong/cs-cham-cong-overview/cs-cham-cong-overview.component';
import { ThietBiWifiChamCongComponent } from 'src/app/components/cs-cham-cong/thiet-bi-wifi-cham-cong/thiet-bi-wifi-cham-cong.component';
import { DsChiTietLuongComponent } from 'src/app/components/cs-tien-luong/ds-chi-tiet-luong/ds-chi-tiet-luong.component';
import { ChuyenVienTinhLuongComponent } from 'src/app/components/cs-tien-luong/chuyen-vien-tinh-luong/chuyen-vien-tinh-luong.component';
import { ChiTietChuyenVienTinhLuongComponent } from 'src/app/components/cs-tien-luong/chuyen-vien-tinh-luong/chi-tiet-chuyen-vien-tinh-luong/chi-tiet-chuyen-vien-tinh-luong.component';
import { NghiKhongLuongComponent } from 'src/app/components/nghi-khong-luong/nghi-khong-luong.component';
import { ChiTietNghiKhongLuongComponent } from 'src/app/components/nghi-khong-luong/chi-tiet-nghi-khong-luong/chi-tiet-nghi-khong-luong.component';
import { ImportExcelComponent } from 'src/app/common/import-excel/import-excel.component';
import { CsLoiChamCongComponent } from 'src/app/components/cs-loi-cham-cong/cs-loi-cham-cong.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "cham-cong",
    pathMatch: 'full'
  },
  // Phép năm
  {
    path: 'phep-nam',
    component: PhepNamComponent,
    data: {
      title: 'Phép năm',
      url: 'phep-nam',
    },
  },
  {
    path: 'thiet-bi-wifi',
    component: ThietBiWifiChamCongComponent,
    data: {
      title: 'Thiết bị wifi chấm công',
      url: 'thiet-bi-wifi',
    },
  },
  // phép bù
  {
    path: 'phep-bu',
    component: PhepBuComponent,
    data: {
      title: 'Phép bù',
      url: 'phep-bu',
    },
  },
  {
    path: 'phep-bu/import',
    component: ImportPhepBuComponent,
    data: {
      title: 'Import phép bù',
      url: 'import-phep-bu',
    },
  },
  {
    path: 'phep-bu/chi-tiet-phep-bu',
    component: ChiTietPhepBuComponent,
    data: {
      title: 'Chi tiết phép bù',
      url: 'chi-tiet-phep-bu',
    },
  },
  {
    path: 'phep-bu/them-moi-phep-bu',
    component: ChiTietPhepBuComponent,
    data: {
      title: 'Thêm mới phép bù',
      url: 'them-moi-phep-bu',
    },
  },
  //Chấm công
  {
    path: 'cham-cong',
    component: CsChamCongComponent,
    data: {
      title: 'Danh sách chấm công',
      url: 'cham-cong',
    },
  },
  {
    path: 'cham-cong/xem-cong',
    component: XemCongComponent,
    data: {
      title: 'Xem công',
      url: 'cham-cong',
    },
  },
  {
    path: 'cham-cong/chi-tiet-cham-cong',
    component: ChiTietChamCongComponent,
    data: {
      title: 'Chi tiết chấm công',
      url: 'chi-tiet-cham-cong',
    },
  },
  {
    path: 'tong-quan-cham-cong',
    component: CsChamCongOverviewComponent,
    data: {
      title: 'Tổng quan chấm công',
      url: 'tong-quan-cham-cong',
    },
  },

  
//nghỉ phép
{
  path: 'giai-trinh-cong',
  component: CsNghiPhepComponent,
  data: {
    title: 'Giải trình công',
    url: 'giai-trinh-cong',
  },
},
{
  path: 'giai-trinh-cong/chi-tiet-giai-trinh-cong',
  component: ChiTietNghiPhepComponent,
  data: {
    title: 'Chi tiết nghỉ phép',
    url: 'giai-trinh-cong/chi-tiet-giai-trinh-cong',
  },
},


//tăng ca
{
  path: 'an-ca',
  component: CsAnCaComponent,
  data: {
    title: 'Danh sách ăn ca',
    url: 'an-ca',
  },
},
{
  path: 'an-ca/chi-tiet-an-ca',
  component: ChiTietAnCaComponent,
  data: {
    title: 'Chi tiết ăn ca',
    url: 'chi-tiet-an-ca',
  },
},
{
  path: 'an-ca/chi-tiet-danh-sach-an-ca',
  component: EatingListComponent,
  data: {
    title: 'Chi tiết ăn ca',
    url: 'chi-tiet-danh-sach-an-ca',
  },
},

//Tiền lương
{
  path: 'tien-luong',
  component: CsTienLuongComponent,
  data: {
    title: 'Danh sách tiền lương',
    url: 'tien-luong',
  },
},
{
  path: 'tien-luong/them-moi-tien-luong',
  component: ChiTietTienLuongComponent,
  data: {
    title: 'Thêm mới tiền lương',
    url: 'them-moi-tien-luong',
  },
},
{
  path: 'tien-luong/chi-tiet-tien-luong',
  component: ChiTietTienLuongComponent,
  data: {
    title: 'Chi tiết tiền lương',
    url: 'chi-tiet-tien-luong',
  },
},
{
  path: 'tien-luong/chi-tiet-thong-tin-luong',
  component: DsChiTietLuongComponent,
  data: {
    title: 'Chi tiết thông tin lương',
    url: 'chi-tiet-thong-tin-luong',
  },
},
 //Thuế thu nhập
{
  path: 'thue-thu-nhap',
  component: CsThueThuNhapComponent,
  data: {
    title: 'Danh sách thuế thu nhập',
    url: 'thue-thu-nhap',
  },
},
{
  path: 'thue-thu-nhap/chi-tiet-thue-thu-nhap',
  component: ChiTietThueThuNhapComponent,
  data: {
    title: 'Chi tiết thuế thu nhập',
    url: 'chi-tiet-thue-thu-nhap',
  },
},
{
  path: 'tai-lieu-chung/:id',
  component: BieuMauChiTietComponent,
  data: {
    title: 'Tài liệu chung chi tiết',
    url: 'tai-lieu-chung/:id',
  },
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
  path: 'tai-lieu-ca-nhan',
  component: BieuMauComponent,
  data: {
    title: 'Tài liệu chung',
    url: 'tai-lieu-ca-nhan',
  },
},
{
  path: 'loai-tai-lieu/:id',
  component: ChiTietLoaiBieuMauComponent,
  data: {
    title: 'Chi tiết loại Tài liệu',
    url: 'loai-tai-lieu/:id',
  },
},
{
  path: 'loai-tai-lieu',
  pathMatch: 'full',
  component: LoaiBieuMauComponent,
  data: {
    title: 'Loại Tài liệu',
    url: 'loai-tai-lieu',
  },
},

{
  path: 'chuyen-vien-tinh-luong',
  component: ChuyenVienTinhLuongComponent,
  data: {
    title: 'Danh sách chuyên viên tính lương',
    url: 'chuyen-vien-tinh-luong',
  },
},
{
  path: 'chuyen-vien-tinh-luong/them-moi-chuyen-vien-tinh-luong',
  component: ChiTietChuyenVienTinhLuongComponent,
  data: {
    title: 'Thêm mới chuyên viên tính lương',
    url: 'them-moi-chuyen-vien-tinh-luong',
  },
},
{
  path: 'chuyen-vien-tinh-luong/chi-tiet-chuyen-vien-tinh-luong',
  component: ChiTietChuyenVienTinhLuongComponent,
  data: {
    title: 'Chi tiết chuyên viên tính lương',
    url: 'chi-tiet-chuyen-vien-tinh-luong',
  },
},

// nghỉ không lương


{
  path: 'nghi-khong-luong',
  component: NghiKhongLuongComponent,
  data: {
    title: 'Danh sách nghỉ không lương',
    url: 'nghi-khong-luong',
  },
},
{
  path: 'nghi-khong-luong/them-moi-nghi-khong-luong',
  component: ChiTietNghiKhongLuongComponent,
  data: {
    title: 'Thêm mới nghỉ không lương',
    url: 'them-moi-nghi-khong-luong',
  },
},
{
  path: 'nghi-khong-luong/chi-tiet-nghi-khong-luong',
  component: ChiTietNghiKhongLuongComponent,
  data: {
    title: 'Chi tiết nghỉ không lương',
    url: 'chi-tiet-nghi-khong-luong',
  },
},
{
  path: 'nghi-khong-luong/import-nghi-khong-luong',
  component: ImportExcelComponent,
  data: {
    title: 'Import danh sách nghỉ không lương',
    url: 'import-nghi-khong-luong',
    titleDad : 'Danh sách danh sách nghỉ không lương',
    urlDad: '/luong-thue/nghi-khong-luong',
    api: 'setLeaveLackImport',
    apiAccept: 'setLeaveLackAccept',
    fileDoc: 'DM_CapBacLuong_Import.xls',
    apiExport: 'setLeaveLackExportDraft',
    apiTemImport: 'getLeaveLackImportTemp',
    fileNameTemImport: 'file_mau_danh_sach_nghi_khong_luong',
  },
},

//Lỗi chấm công

{
  path: 'loi-cham-cong',
  component: CsLoiChamCongComponent,
  data: {
    title: 'Lỗi chấm công',
    url: 'loi-cham-cong',
  },
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChinhSachRoutingModule { }