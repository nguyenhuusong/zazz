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
import { CreateContractInfoComponent } from 'src/app/components/ns-ho-so-nhan-su/create-contract-info/create-contract-info.component';
import { QuyetDinhLuongComponent } from 'src/app/components/quyet-dinh-luong/quyet-dinh-luong.component';
import { ImportXyLyHopDongComponent } from 'src/app/components/xu-ly-hop-dong/import-xy-ly-hop-dong/import-xy-ly-hop-dong.component';
import { ImportHoSoNhanSuComponent } from 'src/app/components/ns-ho-so-nhan-su/import-ho-so-nhan-su/import-ho-so-nhan-su.component';
import { QtThayDoiLuongComponent } from 'src/app/components/qt-thay-doi-luong/qt-thay-doi-luong.component';
import { ChiTietQTThayDoiLuongComponent } from 'src/app/components/qt-thay-doi-luong/chi-tiet-qt-thay-doi-luong/chi-tiet-qt-thay-doi-luong.component';
import { EmployeeInfoComponent } from 'src/app/components/ns-ho-so-nhan-su/employee-info/employee-info.component';
import { ContractDetailComponent } from 'src/app/components/ns-ho-so-nhan-su/contract-detail/contract-detail.component';
import { LyDoNghiViecComponent } from 'src/app/components/ns-ho-so-nghi-viec/ly-do-nghi-viec/ly-do-nghi-viec.component';
import { ChiTietLyDoNghiViecComponent } from 'src/app/components/ns-ho-so-nghi-viec/ly-do-nghi-viec/chi-tiet-ly-do-nghi-viec/chi-tiet-ly-do-nghi-viec.component';
import { DetailTerminateComponent } from 'src/app/components/ns-ho-so-nghi-viec/detail-terminate/detail-terminate.component';
import { ImportTerminateComponent } from 'src/app/components/ns-ho-so-nghi-viec/import-terminate/import-terminate.component';
import { XuLyQuaTrinhCongTacComponent } from 'src/app/components/xu-ly-qua-trinh-cong-tac/xu-ly-qua-trinh-cong-tac.component';
import { ChiTietXuLyQtCongTacComponent } from 'src/app/components/xu-ly-qua-trinh-cong-tac/chi-tiet-xu-ly-qt-cong-tac/chi-tiet-xu-ly-qt-cong-tac.component';
import { ImportQtThayDoiLuongComponent } from 'src/app/components/qt-thay-doi-luong/import-qt-thay-doi-luong/import-qt-thay-doi-luong.component';
import { ChiTietBienDongBHXHComponent } from 'src/app/components/bien-dong-bhxh/chi-tiet-bien-dong-bhxh/chi-tiet-bien-dong-bhxh.component';
import { BienDongBHXHComponent } from 'src/app/components/bien-dong-bhxh/bien-dong-bhxh.component';
import { ImportExcelComponent } from 'src/app/common/import-excel/import-excel.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "ho-so-nhan-su",
    pathMatch: 'full'
  },
 // quyết định lương

 {
  path: 'quyet-dinh-luong',
  component: QuyetDinhLuongComponent,
  data: {
    title: 'Quyết định lương',
    url: 'quyet-dinh-luong',
  },
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
    path: 'xu-ly-hop-dong/chi-tiet-xu-ly-hop-dong',
    component: ContractDetailComponent,
    data: {
      title: 'Danh sách xử lý hợp đồng',
      url: 'chi-tiet-xu-ly-hop-dong',
    },
  },
  {
    path: 'xu-ly-qua-trinh-cong-tac',
    component: XuLyQuaTrinhCongTacComponent,
    data: {
      title: 'Danh sách quá trình công tác',
      url: 'xu-ly-qua-trinh-cong-tac',
    },
  },
  {
    path: 'xu-ly-qua-trinh-cong-tac/them-moi-xu-ly-qua-trinh-cong-tac',
    component: ChiTietXuLyQtCongTacComponent,
    data: {
      title: 'Thêm mới quá trình công tác',
      url: 'them-moi-xu-ly-qua-trinh-cong-tac',
    },
  },
  {
    path: 'xu-ly-qua-trinh-cong-tac/chi-tiet-xu-ly-qua-trinh-cong-tac',
    component: ChiTietXuLyQtCongTacComponent,
    data: {
      title: 'Chi tiết quá trình công tác',
      url: 'chi-tiet-xu-ly-qua-trinh-cong-tac',
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
    path: 'ho-so-nhan-su/import',
    component: ImportHoSoNhanSuComponent,
    data: {
      title: 'Import hồ sơ nhân sự',
      url: 'import-ho-so-nhan-su',
    },
  },
  {
    path: 'ho-so-nhan-su/chi-tiet-ho-so-nhan-su',
    component: EmployeeInfoComponent,
    data: {
      title: 'Chi tiết hồ sơ nhân sự',
      url: 'chi-tiet-ho-so-nhan-su',
    },
  },

  //Ly do nghỉ việc

  {
    path: 'ly-do-nghi-viec',
    component: LyDoNghiViecComponent,
    data: {
      title: 'Danh sách lý do tuyển dụng',
      url: 'ly-do-nghi-viec',
    },
  },
  {
    path: 'ly-do-nghi-viec/them-moi-ly-do-nghi-viec',
    component: ChiTietLyDoNghiViecComponent,
    data: {
      title: 'Thêm mới lý do tuyển dụng',
      url: 'them-moi-ly-do-nghi-viec',
    },
  },
  {
    path: 'ly-do-nghi-viec/chi-tiet-ly-do-nghi-viec',
    component: ChiTietLyDoNghiViecComponent,
    data: {
      title: 'Chi tiết lý do tuyển dụng',
      url: 'chi-tiet-ly-do-nghi-viec',
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
    component: DetailTerminateComponent,
    data: {
      title: 'Chi tiết hồ sơ nghỉ việc',
      url: 'ho-so-nghi-viec/chi-tiet-ho-so-nghi-viec',
    },
  },
  {
    path: 'ho-so-nghi-viec/import',
    component: ImportTerminateComponent,
    data: {
      title: 'Import hồ sơ nghỉ việc',
      url: 'ho-so-nghi-viec/import',
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
  {
    path: 'phe-duyet/chi-tiet-phe-duyet',
    component: ChiTietPheDuyetComponent,
    data: {
      title: 'Chi tiết phê duyệt',
      url: 'chi-tiet-phe-duyet',
    },
  },
  {
    path: 'xu-ly-hop-dong/import',
    component: ImportXyLyHopDongComponent,
    data: {
      title: 'Import loại hợp đồng',
      url: 'import-loai-hop-dong',
    },
  },

  // Quá trình thay đổi lương
  {
   path: 'qua-trinh-thay-doi-luong',
   component: QtThayDoiLuongComponent,
   data: {
     title: 'Quá trình thay đổi lương',
     url: 'qua-trinh-thay-doi-luong',
   },
 },
  {
   path: 'qua-trinh-thay-doi-luong/import-salary',
   component: ImportQtThayDoiLuongComponent,
   data: {
     title: 'Import quá trình thay đổi lương',
     url: 'import-salary',
   },
 },
 {
  path: 'qua-trinh-thay-doi-luong/them-moi-qua-trinh-thay-doi-luong',
  component: ChiTietQTThayDoiLuongComponent,
  data: {
    title: 'Thêm mới quá trình thay đổi lương',
    url: 'them-moi-qua-trinh-thay-doi-luong',
  },
 },
 {
  path: 'qua-trinh-thay-doi-luong/chi-tiet-qua-trinh-thay-doi-luong',
  component: ChiTietQTThayDoiLuongComponent,
  data: {
    title: 'Chi tiết quá trình thay đổi lương',
    url: 'chi-tiet-qua-trinh-thay-doi-luong',
  },
},

// biến động bhxh

{
  path: 'bien-dong-bhxh',
  component: BienDongBHXHComponent,
  data: {
    title: 'Biến động bảo hiểm xã hội',
    url: 'bien-dong-bhxh',
  },
},
{
  path: 'bien-dong-bhxh/them-moi-bien-dong-bhxh',
  component: ChiTietBienDongBHXHComponent,
  data: {
    title: 'Thêm mới biến động bhxh',
    url: 'bien-dong-bhxh/them-moi-bien-dong-bhxh',
  },
},
{
  path: 'bien-dong-bhxh/chi-tiet-bien-dong-bhxh',
  component: ChiTietBienDongBHXHComponent,
  data: {
    title: 'Chi tiết biến động bhxh',
    url: 'bien-dong-bhxh/chi-tiet-bien-dong-bhxh',
  },
},

{
  path: 'bien-dong-bhxh/import-bien-dong-bhxh',
  component: ImportExcelComponent,
  data: {
    title: 'Import biến động BHXH',
    url: 'import-bien-dong-bhxh',
    titleDad : 'Danh sách biến động BHXH',
    urlDad: '/nhan-su/bien-dong-bhxh',
    api: 'setInsuranceImport',
    apiAccept: 'setInsuranceAccept',
    fileDoc: 'bien_dong_bhxh_import.xlsx',
    apiExport: 'setInsuranceExportDraft',
    apiTemImport: 'getInsuranceImportTemp',
    fileNameTemImport: 'file_mau_bien_dong_xa_hoi',
  },
},

{
  path: 'xu-ly-qua-trinh-cong-tac/import-xu-ly-qua-trinh-cong-tac',
  component: ImportExcelComponent,
  data: {
    title: 'Import xử lý quá trình công tác',
    url: 'import-xu-ly-qua-trinh-cong-tac',
    titleDad : 'Xử lý quá trình công tác',
    urlDad: '/nhan-su/xu-ly-qua-trinh-cong-tac',
    api: 'setWorkplaceImport',
    apiAccept: 'setEmpProcessAccept',
    fileDoc: 'temp.xls',
    apiExport: 'setEmpProcessExportDraft',
    apiTemImport: 'getEmpProcessImportTemp',
    fileNameTemImport: 'file_mau_xu_ly_qua_trinh_cong_tac',
  },
},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NhanSuRoutingModule { }




