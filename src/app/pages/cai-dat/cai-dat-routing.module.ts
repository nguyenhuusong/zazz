import { ThamSoChungDetailComponent } from './../../components/cai-dat-to-chuc/tham-so-chung/tham-so-chung-detail/tham-so-chung-detail.component';
import { ThamSoChungListComponent } from './../../components/cai-dat-to-chuc/tham-so-chung/tham-so-chung-list/tham-so-chung-list.component';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CaiDatLichHopComponent } from 'src/app/components/cai-dat-lich-hop/cai-dat-lich-hop.component';
import { CaiDatToChucComponent } from 'src/app/components/cai-dat-to-chuc/cai-dat-to-chuc.component';
import { CaiDatCongTyComponent } from 'src/app/components/cai-dat-cong-ty/cai-dat-cong-ty.component';
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
import { LyDoNghiViecComponent } from 'src/app/components/ly-do-nghi-viec/ly-do-nghi-viec.component';
import { ChiTietLyDoNghiViecComponent } from 'src/app/components/ly-do-nghi-viec/chi-tiet-ly-do-nghi-viec/chi-tiet-ly-do-nghi-viec.component';
import { NgayNghiLeComponent } from 'src/app/components/ngay-nghi-le/ngay-nghi-le.component';
import { ChiTietNgayNghiComponent } from 'src/app/components/ngay-nghi-le/chi-tiet-ngay-nghi/chi-tiet-ngay-nghi.component';
import { ThietLapWifiComponent } from 'src/app/components/thiet-lap-wifi/thiet-lap-wifi.component';
import { ChiTietThietLapWifiComponent } from 'src/app/components/thiet-lap-wifi/chi-tiet-thiet-lap-wifi/chi-tiet-thiet-lap-wifi.component';
import { LoaiToChucComponent } from 'src/app/components/cai-dat-to-chuc/loai-to-chuc/loai-to-chuc.component';
import { ChiTietLoaiToChucComponent } from 'src/app/components/cai-dat-to-chuc/loai-to-chuc/chi-tiet-loai-to-chuc/chi-tiet-loai-to-chuc.component';
import { ChucDanhComponent } from 'src/app/components/chuc-danh/chuc-danh.component';
import { ChiTietChucDanhComponent } from 'src/app/components/chuc-danh/chi-tiet-chuc-danh/chi-tiet-chuc-danh.component';
import { DanhMucLoaiGiayToComponent } from 'src/app/components/danh-muc-loai-giay-to/danh-muc-loai-giay-to.component';
import { ChiTietLoaiGiayToComponent } from 'src/app/components/danh-muc-loai-giay-to/chi-tiet-loai-giay-to/chi-tiet-loai-giay-to.component';
import { ImportExcelComponent } from 'src/app/common/import-excel/import-excel.component';
import { ProvinceComponent } from 'src/app/components/province/province.component';
import { DetailProvinceComponent } from 'src/app/components/province/detail-province/detail-province.component';
import { DanhSachCapBacComponent } from 'src/app/components/cai-dat-to-chuc/danh-sach-cap-bac/danh-sach-cap-bac.component';
import { ChiTietCapBacComponent } from 'src/app/components/cai-dat-to-chuc/danh-sach-cap-bac/chi-tiet-cap-bac/chi-tiet-cap-bac.component';

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
    path: 'cai-dat-to-chuc/import-to-chuc',
    component: ImportExcelComponent,
    data: {
      title: 'Import tổ chức',
      url: 'import-to-chuc',
      titleDad : 'Danh sách quản lý tổ chức',
      urlDad: '/cai-dat/cai-dat-to-chuc',
      api: 'setOrganizeImport',
      apiAccept: 'setOrganizeAccept',
      fileDoc: 'file_mau_import_danh_muc_to_chuc.xlsx',
      apiExport: 'setOrganizeExportDraft'
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
    path: 'cai-dat-cong-ty/import-cong-ty',
    component: ImportExcelComponent,
    data: {
      title: 'Import công ty',
      url: 'import-cong-ty',
      titleDad : 'Danh sách công ty',
      urlDad: '/cai-dat/cai-dat-cong-ty',
      api: 'setCompanyImport',
      apiAccept: 'setCompanyAccept',
      fileDoc: 'DM_CongTy_Import.xls',
      apiExport: 'setCompanyExportDraft',
      apiTemImport: 'getCompanyImportTemp',
      fileNameTemImport: 'file_mau_danh_muc_cong_ty',
    },
  },
  {
    path: 'cai-dat-cong-ty/them-moi-cong-ty',
    component: ChiTietCongTyComponent,
    data: {
      title: 'Thêm mới công ty',
      url: 'them-moi-cong-ty',
    },
  },
  {
    path: 'cai-dat-cong-ty/chi-tiet-cong-ty',
    component: ChiTietCongTyComponent,
    data: {
      title: 'Chi tiết công ty',
      url: 'chi-tiet-cong-ty',
    },
  },


  // Lý do nghỉ việc 
  {
    path: 'ly-do-nghi',
    component: LyDoNghiViecComponent,
    data: {
      title: 'Lý do nghỉ việc',
      url: 'ly-do-nghi',
    },
  },
  {
    path: 'ly-do-nghi/them-moi-ly-do-nghi',
    component: ChiTietLyDoNghiViecComponent,
    data: {
      title: 'Thêm mới lý do nghỉ việc',
      url: 'them-moi-ly-do-nghi',
    },
  },
  {
    path: 'ly-do-nghi/chi-tiet-ly-do-nghi',
    component: ChiTietLyDoNghiViecComponent,
    data: {
      title: 'Chi tiết lý do nghỉ việc',
      url: 'chi-tiet-ly-do-nghi',
    },
  },

  {
    path: 'ly-do-nghi/import-ly-do-nghi',
    component: ImportExcelComponent,
    data: {
      title: 'Import lý do nghỉ',
      url: 'import-ly-do-nghi',
      titleDad : 'Danh sách lý do nghỉ việc',
      urlDad: '/cai-dat/ly-do-nghi',
      api: 'setLeaveReasonImport',
      apiAccept: 'setLeaveReasonAccept',
      fileDoc: 'DM_LyDoNghi_Import.xls',
      apiExport: 'setLeaveReasonExportDraft',
      apiTemImport: 'getLeaveReasonImportTemp',
      fileNameTemImport: 'file_mau_ly_do_nghi',
    },
  },

  // cài đặt ngày nghỉ lễ
  {
    path: 'cai-dat-ngay-nghi-le',
    component: NgayNghiLeComponent,
    data: {
      title: 'Danh sách ngày nghỉ lễ',
      url: 'cai-dat-ngay-nghi-le',
    },
  },
  {
    path: 'cai-dat-ngay-nghi-le/them-moi-ngay-nghi',
    component: ChiTietNgayNghiComponent,
    data: {
      title: 'Thêm mới ngày nghỉ',
      url: 'them-moi-ngay-nghi',
    },
  },
  {
    path: 'cai-dat-ngay-nghi-le/chi-tiet-ngay-nghi',
    component: ChiTietNgayNghiComponent,
    data: {
      title: 'Chi tiết ngày nghỉ',
      url: 'chi-tiet-ngay-nghi',
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
    path: 'chuc-vu/import-chuc-vu',
    component: ImportExcelComponent,
    data: {
      title: 'Import chức vụ',
      url: 'import-chuc-vu',
      titleDad : 'Danh sách chức vụ',
      urlDad: '/cai-dat/chuc-vu',
      api: 'setPositionImport',
      apiAccept: 'setPositionAccept',
      fileDoc: 'DM_ChucVu_Import.xls',
      apiExport: 'setPositionExportDraft',
      apiTemImport: 'getPositionImportTemp',
      fileNameTemImport: 'file_mau_danh_muc_chuc_vu',
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
   // Cài đặt chức danh
   {
    path: 'chuc-danh',
    component: ChucDanhComponent,
    data: {
      title: 'Danh sách chức danh',
      url: 'chuc-danh',
    },
  },
  {
    path: 'chuc-danh/import-chuc-danh',
    component: ImportExcelComponent,
    data: {
      title: 'Import chức danh',
      url: 'import-chuc-danh',
      titleDad : 'Danh sách chức danh',
      urlDad: '/cai-dat/chuc-danh',
      api: 'setPositionTitleImport',
      apiAccept: 'setPositionTitleAccept',
      fileDoc: 'DM_ChucDanh_Import.xls',
      apiExport: 'setPositionTitleExportDraft',
      apiTemImport: 'getPositionTitleImportTemp',
      fileNameTemImport: 'file_mau_danh_muc_chuc_danh',
    },
  },
  {
    path: 'chuc-danh/them-moi-chuc-danh',
    component: ChiTietChucDanhComponent,
    data: {
      title: 'Thêm mới chức danh',
      url: 'them-moi-chuc-danh',
    },
  },
  {
    path: 'chuc-danh/chi-tiet-chuc-danh',
    component: ChiTietChucDanhComponent,
    data: {
      title: 'Chi tiết chức danh',
      url: 'chi-tiet-chuc-danh',
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
    path: 'noi-lam-viec/import-noi-lam-viec',
    component: ImportExcelComponent,
    data: {
      title: 'Import nơi làm việc',
      url: 'import-noi-lam-viec',
      titleDad : 'Danh sách nơi làm việc',
      urlDad: '/cai-dat/noi-lam-viec',
      api: 'setWorkplaceImport',
      apiAccept: 'setWorkplaceAccept',
      fileDoc: 'DM_NoiLamViec_Import.xls',
      apiExport: 'setWorkplaceExportDraft',
      apiTemImport: 'getWorkplaceImportTemp',
      fileNameTemImport: 'file_mau_noi_lam_viec',
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

  // Tỉnh thành

  {
    path: 'tinh-thanh',
    component: ProvinceComponent,
    data: {
      title: 'Danh sách tỉnh thành',
      url: 'tinh-thanh',
    },
  },
  {
    path: 'tinh-thanh/import-tinh-thanh',
    component: ImportExcelComponent,
    data: {
      title: 'Import tỉnh thành',
      url: 'import-tinh-thanh',
      titleDad : 'Danh sách tỉnh thành',
      urlDad: '/cai-dat/tinh-thanh',
      api: 'setWorkplaceImport',
      apiAccept: 'setWorkplaceAccept',
      fileDoc: 'DM_NoiLamViec_Import.xls',
      apiExport: 'setWorkplaceExportDraft'
    },
  },
  {
    path: 'tinh-thanh/them-moi-tinh-thanh',
    component: DetailProvinceComponent,
    data: {
      title: 'Thêm mới tỉnh thành',
      url: 'them-moi-tinh-thanh',
    },
  },
  {
    path: 'tinh-thanh/chi-tiet-tinh-thanh',
    component: DetailProvinceComponent,
    data: {
      title: 'Chi tiết tỉnh thành',
      url: 'chi-tiet-tinh-thanh',
    },
  },

   // Loại tổ chức
   {
    path: 'loai-to-chuc',
    component: LoaiToChucComponent,
    data: {
      title: 'Danh sách loại tổ chức',
      url: 'loai-to-chuc',
    },
  },
  {
    path: 'loai-to-chuc/them-moi-loai-to-chuc',
    component: ChiTietLoaiToChucComponent,
    data: {
      title: 'Thêm mới loại tổ chức',
      url: 'them-moi-loai-to-chuc',
    },
  },
  {
    path: 'loai-to-chuc/chi-tiet-loai-to-chuc',
    component: ChiTietLoaiToChucComponent,
    data: {
      title: 'Chi tiết loại tổ chức',
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
    path: 'lich-lam-viec/import-lich-lam-viec',
    component: ImportExcelComponent,
    data: {
      title: 'Import lịch làm việc',
      url: 'import-lich-lam-viec',
      titleDad : 'Danh sách lịch làm việc',
      urlDad: '/cai-dat/lich-lam-viec',
      api: 'setWorktimeImport',
      apiAccept: 'setWorktimeAccept',
      fileDoc: 'DM_LichLamViec_Import.xls',
      apiExport: 'setWorktimeExportDraft',
      apiTemImport: 'getWorktimeImportTemp',
      fileNameTemImport: 'file_mau_lich_lam_viec',
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
      title: 'Danh sách quản lý hợp đồng mẫu',
      url: 'quan-ly-hop-dong',
    },
  },
  {
    path: 'quan-ly-hop-dong/them-moi-hop-dong',
    component: ChiTietHopDongComponent,
    data: {
      title: 'Thêm mới hợp đồng mẫu',
      url: 'them-moi-hop-dong',
    },
  },
  {
    path: 'quan-ly-hop-dong/chi-tiet-hop-dong',
    component: ChiTietHopDongComponent,
    data: {
      title: 'Chi tiết hợp đồng mẫu',
      url: 'chi-tiet-hop-dong',
    },
  },

  {
    path: 'quan-ly-hop-dong/import-hop-dong-mau',
    component: ImportExcelComponent,
    data: {
      title: 'Import hợp đồng mẫu',
      url: 'import-hop-dong-mau',
      titleDad : 'Danh sách quản lý hợp đồng mẫu',
      urlDad: '/cai-dat/quan-ly-hop-dong',
      api: 'setContractTypeImport',
      apiAccept: 'setLeaveReasonAccept',
      fileDoc: 'DM_HopDongMau_Import.xls',
      apiExport: 'setLeaveReasonExportDraft',
      apiTemImport: 'getContractTypeImportTemp',
      fileNameTemImport: 'file_mau_hop_dong_mau',
    },
  },

  

  // Danh mục loại giấy tờ

  {
    path: 'cai-dat-loai-giay-to',
    component: DanhMucLoaiGiayToComponent,
    data: {
      title: 'Danh mục loại giấy tờ',
      url: 'cai-dat-loai-giay-to',
    },
  },
  {
    path: 'cai-dat-loai-giay-to/them-moi-loai-giay-to',
    component: ChiTietLoaiGiayToComponent,
    data: {
      title: 'Thêm mới loại giấy tờ',
      url: 'them-moi-loai-giay-to',
    },
  },
  {
    path: 'cai-dat-loai-giay-to/chi-tiet-loai-giay-to',
    component: ChiTietLoaiGiayToComponent,
    data: {
      title: 'Chi tiết loại giấy tờ',
      url: 'chi-tiet-loai-giay-to',
    },
  },


  // Quản lý phòng họp theo tầng

  // {
  //   path: 'quan-ly-phong-hop-theo-tang',
  //   component: CaiDatPhongHopTheoTangComponent,
  //   data: {
  //     title: 'Danh sách tầng',
  //     url: 'quan-ly-phong-hop-theo-tang',
  //   },
  // },
  // {
  //   path: 'quan-ly-phong-hop-theo-tang/them-moi-tang',
  //   component: ChiTietPhongHopTheoTangComponent,
  //   data: {
  //     title: 'Thêm mới Phòng họp theo tầng',
  //     url: 'them-moi-phong-hop-theo-tang',
  //   },
  // },
  // {
  //   path: 'quan-ly-phong-hop-theo-tang/chi-tiet-tang',
  //   component: ChiTietPhongHopTheoTangComponent,
  //   data: {
  //     title: 'Chi tiết Phòng họp theo tầng',
  //     url: 'chi-tiet-phong-hop-theo-tang',
  //   },
  // },
  
  {
    path: 'tham-so-chung/:id',
    component: ThamSoChungDetailComponent,
    data: {
      title: 'Chi tiết tham số chung',
      url: 'chi-tiet-tham-so-chung',
    },
  },
  {
    path: 'tham-so-chung',
    pathMatch: 'full',
    component: ThamSoChungListComponent,
    data: {
      title: 'Tham số chung',
      url: 'tham-so-chung',
    },
  },

  // Cài đặt thiết lập wifi
  {
    path: 'thiet-lap-wifi',
    component: ThietLapWifiComponent,
    data: {
      title: 'Danh sách thiết lập wifi',
      url: 'thiet-lap-wifi',
    },
  },
  {
    path: 'thiet-lap-wifi/import-thiet-lap-wifi',
    component: ImportExcelComponent,
    data: {
      title: 'Import thiết lập wifi',
      url: 'import-thiet-lap-wifi',
      titleDad : 'Danh sách thiết lập wifi',
      urlDad: '/cai-dat/thiet-lap-wifi',
      api: 'setTimekeepingWifiImport',
      apiAccept: 'setTimekeepingWifiAccept',
      fileDoc: 'DM_ThietLapWiFi_Import.xls',
      apiExport: 'setTimekeepingWifiExportDraft',
      apiTemImport: 'getTimekeepingWifiImportTemp',
      fileNameTemImport: 'file_mau_thiet_bi_wifi',
    },
  },
  {
    path: 'thiet-lap-wifi/them-moi',
    component: ChiTietThietLapWifiComponent,
    data: {
      title: 'Thêm mới thiết lập wifi',
      url: 'them-moi-thiet-lap-wifi',
    },
  },
  {
    path: 'thiet-lap-wifi/chi-tiet',
    component: ChiTietThietLapWifiComponent,
    data: {
      title: 'Chi tiết thiết lập wifi',
      url: 'chi-tiet-thiet-lap-wifi',
    },
  },

  
  // danh sách cấp bậc
  {
    path: 'danh-sach-cap-bac',
    component: DanhSachCapBacComponent,
    data: {
      title: 'Danh sách cấp bậc',
      url: 'danh-sach-cap-bac',
    },
  },
  {
    path: 'danh-sach-cap-bac/import-cap-bac',
    component: ImportExcelComponent,
    data: {
      title: 'Import cấp bậc',
      url: 'import-cap-bac',
      titleDad : 'Danh sách cấp bậc',
      urlDad: '/cai-dat/danh-sach-cap-bac',
      api: 'setCompanyImport',
      apiAccept: 'setCompanyAccept',
      fileDoc: 'DM_CongTy_Import.xls',
      apiExport: 'setCompanyExportDraft',
      apiTemImport: 'getCompanyImportTemp',
      fileNameTemImport: 'file_mau_danh_muc_cong_ty',
    },
  },
  {
    path: 'danh-sach-cap-bac/them-moi-cap-bac',
    component: ChiTietCapBacComponent,
    data: {
      title: 'Thêm mới cấp bậc',
      url: 'them-moi-cap-bac',
    },
  },
  {
    path: 'danh-sach-cap-bac/chi-tiet-cap-bac',
    component: ChiTietCapBacComponent,
    data: {
      title: 'Chi tiết cấp bậc',
      url: 'chi-tiet-cap-bac',
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaiDatRoutingModule { }