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
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NhanSuRoutingModule { }




