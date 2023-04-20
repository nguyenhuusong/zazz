import { ChiTietHoSoCaNhanComponent } from './../../components/ho-so-ca-nhan/chi-tiet-ho-so-ca-nhan/chi-tiet-ho-so-ca-nhan.component';
import { HoSoCaNhanComponent } from './../../components/ho-so-ca-nhan/ho-so-ca-nhan.component';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NsTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/ns-tuyen-dung.component';
import { ViTriTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/vi-tri-tuyen-dung/vi-tri-tuyen-dung.component';
import { ChiTietViTriTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chi-tiet-vi-tri-tuyen-dung/chi-tiet-vi-tri-tuyen-dung.component';
import { ChiTietLinhVucTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chi-tiet-linh-vuc-tuyen-dung/chi-tiet-linh-vuc-tuyen-dung.component';
import { ChiTietTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chi-tiet-tuyen-dung/chi-tiet-tuyen-dung.component';
import { LinhVucTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/linh-vuc-tuyen-dung/linh-vuc-tuyen-dung.component';
import { NghiViecComponent } from 'src/app/components/ns-tuyen-dung/nghi-viec/nghi-viec.component';
import { MailTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/mail-tuyen-dung/mail-tuyen-dung.component';
import { ChiTietMailTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/mail-tuyen-dung/chi-tiet-mail-tuyen-dung/chi-tiet-mail-tuyen-dung.component';
import { DsTiemNangComponent } from 'src/app/components/ns-tuyen-dung/ds-tiem-nang/ds-tiem-nang.component';
import { MailDaGuiComponent } from 'src/app/components/ns-tuyen-dung/mail-da-gui/mail-da-gui.component';
import { KeHoachTuyenDungComponent } from 'src/app/components/ke-hoach-tuyen-dung/ke-hoach-tuyen-dung.component';
import { ChiTietKeHoachTuyenDungComponent } from 'src/app/components/ke-hoach-tuyen-dung/chi-tiet-ke-hoach-tuyen-dung/chi-tiet-ke-hoach-tuyen-dung.component';
import { ImportExcelComponent } from 'src/app/common/import-excel/import-excel.component';
import { CauHinhMailComponent } from 'src/app/components/ns-tuyen-dung/cau-hinh-mail/cau-hinh-mail.component';
import { VongTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/vong-tuyen-dung/vong-tuyen-dung.component';
import { NguonTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/nguon-tuyen-dung/nguon-tuyen-dung.component';
import { ChuyenVienTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chuyen-vien-tuyen-dung/chuyen-vien-tuyen-dung.component';
import { ChiTietChuyenVienTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/chuyen-vien-tuyen-dung/chi-tiet-chuyen-vien-tuyen-dung/chi-tiet-chuyen-vien-tuyen-dung.component';
import { LichSuTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/lich-su-tuyen-dung/lich-su-tuyen-dung.component';

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
    path: 'ds-tuyen-dung/ds-tiem-nang',
    component: DsTiemNangComponent,
    data: {
      title: 'Danh sách tiềm năng',
      url: 'ds-tiem-nang',
    },
  },
  {
    path: 'ds-tuyen-dung/lich-su-tuyen-dung',
    component: LichSuTuyenDungComponent,
    data: {
      title: 'Danh sách lịch sử tuyển dụng',
      url: 'lich-su-tuyen-dung',
    },
  },
  {
    path: 'ds-tuyen-dung/import-tuyen-dung',
    component: ImportExcelComponent,
    data: {
      title: 'Import tuyển dụng',
      url: 'import-tuyen-dung',
      titleDad : 'Danh sách tuyển dụng',
      urlDad: '/tuyen-dung/ds-tuyen-dung',
      api: 'setCandidatesImport',
      apiAccept: 'setCandidatesAccept',
      fileDoc: 'tuyen_dung_import.xls',
      apiExport: 'setCandidateExportDraft',
      apiTemImport: 'getCandidateImportTemp',
      fileNameTemImport: 'file_mau_tuyen_dung',
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
      title: 'Chi tiết tuyển dụng ',
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
  //ke hoach tuyen dung

  {
    path: 'ke-hoach-tuyen-dung',
    component: KeHoachTuyenDungComponent,
    data: {
      title: 'Danh sách kế hoạch tuyển dụng',
      url: 'ke-hoach-tuyen-dung',
    },
  },
  {
    path: 'ke-hoach-tuyen-dung/import-ke-hoach-tuyen-dung',
    component: ImportExcelComponent,
    data: {
      title: 'Import kế hoạch tuyển dụng',
      url: 'import-ke-hoach-tuyen-dung',
      titleDad : 'Danh sách kế hoạch tuyển dụng',
      urlDad: '/tuyen-dung/ke-hoach-tuyen-dung',
      api: 'setRecruitPlanImport',
      apiAccept: 'setRecruitPlanAccept',
      fileDoc: 'ke_hoach_tuyen_dung_import.xls',
      apiExport: 'setRecruitPlanExportDraft',
      apiTemImport: 'getRecruitPlanImportTemp',
      fileNameTemImport: 'file_mau_ke_hoach_tuyen_dung',
    },
  },
  {
    path: 'ke-hoach-tuyen-dung/them-moi-ke-hoach-tuyen-dung',
    component: ChiTietKeHoachTuyenDungComponent,
    data: {
      title: 'Thêm mới kế hoạch tuyển dụng',
      url: 'them-moi-ke-hoach-tuyen-dung',
    },
  },
  {
    path: 'ke-hoach-tuyen-dung/chi-tiet-ke-hoach-tuyen-dung',
    component: ChiTietKeHoachTuyenDungComponent,
    data: {
      title: 'Chi tiết kế hoạch tuyển dụng',
      url: 'chi-tiet-ke-hoach-tuyen-dung',
    },
  },
  {
    path: 'danh-sach-nghi-viec',
    component: NghiViecComponent,
    data: {
      title: 'Danh sách nghỉ việc',
      url: 'danh-sach-nghi-viec',
    },
  },
  
//Chuyên môn
  {
    path: 'chuyen-mon',
    component: LinhVucTuyenDungComponent,
    data: {
      title: 'Danh sách chuyên môn tuyển dụng',
      url: 'chuyen-mon',
    },
  },
  {
    path: 'chuyen-mon/import-chuyen-mon',
    component: ImportExcelComponent,
    data: {
      title: 'Import chuyên môn',
      url: 'import-chuyen-mon',
      titleDad : 'Danh sách chuyên môn tuyển dụng',
      urlDad: '/tuyen-dung/chuyen-mon',
      api: 'setJobImport',
      apiAccept: 'setJobAccept',
      fileDoc: 'DM_ChuyenMon_Import.xls',
      apiExport: 'setJobExportDraft',
      apiTemImport: 'getJobImportTemp',
      fileNameTemImport: 'file_mau_danh_muc_chuyen_mon',
    },
  },
  {
    path: 'chuyen-mon/them-moi-linh-vuc-tuyen-dung',
    component: ChiTietLinhVucTuyenDungComponent,
    data: {
      title: 'Thêm mới chuyên môn tuyển dụng',
      url: 'them-moi-linh-vuc-tuyen-dung',
    },
  },
  {
    path: 'chuyen-mon/chi-tiet-linh-vuc-tuyen-dung',
    component: ChiTietLinhVucTuyenDungComponent,
    data: {
      title: 'Chi tiết chuyên môn tuyển dụng',
      url: 'chi-tiet-linh-vuc-tuyen-dung',
    },
  },
  // mail da gui
  {
    path: 'mail-da-gui',
    component: MailDaGuiComponent,
    data: {
      title: 'Danh sách mail đã gửi',
      url: 'mail-da-gui',
    },
  },

  // mail tuyen dung
  {
    path: 'mail-tuyen-dung',
    component: MailTuyenDungComponent,
    data: {
      title: 'Danh sách mail tuyển dụng',
      url: 'mail-tuyen-dung',
    },
  },
  {
    path: 'mail-tuyen-dung/them-moi-mail-tuyen-dung',
    component: ChiTietMailTuyenDungComponent,
    data: {
      title: 'Thêm mới mail tuyển dụng',
      url: 'them-moi-mail-tuyen-dung',
    },
  },
  {
    path: 'mail-tuyen-dung/chi-tiet-mail-tuyen-dung',
    component: ChiTietMailTuyenDungComponent,
    data: {
      title: 'Chi tiết mail',
      url: 'chi-tiet-mail-tuyen-dung',
    },
  },

  // cau hinh
  // {
  //   path: 'cau-hinh',
  //   component: NsCauHinhComponent,
  //   data: {
  //     title: 'Cấu hình',
  //     url: 'cau-hinh',
  //   },
  // },
  
  // cau hinh mail
  {
    path: 'cau-hinh-mail',
    component: CauHinhMailComponent,
    data: {
      title: 'Cấu hình mail',
      url: 'cau-hinh mail',
    },
  },
// Vòng tuyển dụng
{
  path: 'vong-tuyen-dung',
  component: VongTuyenDungComponent,
  data: {
    title: 'Vòng tuyển dụng',
    url: 'vong-tuyen-dung',
  },
},
// nguon tuyen dung
{
  path: 'nguon-tuyen-dung',
  component: NguonTuyenDungComponent,
  data: {
    title: 'Nguồn tuyển dụng',
    url: 'nguon-tuyen-dung',
  },
},

{
  path: 'chuyen-vien-tuyen-dung',
  component: ChuyenVienTuyenDungComponent,
  data: {
    title: 'Danh sách tuyển dụng',
    url: 'chuyen-vien-tuyen-dung',
  },
},

{
  path: 'chuyen-vien-tuyen-dung/them-moi-chuyen-vien-tuyen-dung',
  component: ChiTietChuyenVienTuyenDungComponent,
  data: {
    title: 'Thêm mới chuyên viên tuyển dụng',
    url: 'them-moi-chuyen-vien-tuyen-dung',
  },
},
{
  path: 'chuyen-vien-tuyen-dung/chi-tiet-chuyen-vien-tuyen-dung',
  component: ChiTietChuyenVienTuyenDungComponent,
  data: {
    title: 'Chi tiết chuyên viên tuyển dụng ',
    url: 'chi-tiet-chuyen-vien-tuyen-dung',
  },
},

// Hồ sơ cá nhân

{
  path: 'ho-so-ca-nhan',
  component: HoSoCaNhanComponent,
  data: {
    title: 'Danh sách vị trí tuyển dụng',
    url: 'ho-so-ca-nhan',
  },
},
{
  path: 'ho-so-ca-nhan/them-moi-ho-so-ca-nhan',
  component: ChiTietHoSoCaNhanComponent,
  data: {
    title: 'Thêm mới hồ sơ cá nhân',
    url: 'them-moi-ho-so-ca-nhan',
  },
},
{
  path: 'ho-so-ca-nhan/chi-tiet-ho-so-ca-nhan',
  component: ChiTietHoSoCaNhanComponent,
  data: {
    title: 'Chi tiết hồ sơ cá nhân',
    url: 'chi-tiet-ho-so-ca-nhan',
  },
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TuyenDungRoutingModule { }




