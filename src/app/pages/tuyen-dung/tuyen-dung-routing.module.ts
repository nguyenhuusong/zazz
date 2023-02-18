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
import { ImportTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/import-tuyen-dung/import-tuyen-dung.component';
import { DsTiemNangComponent } from 'src/app/components/ns-tuyen-dung/ds-tiem-nang/ds-tiem-nang.component';
import { MailDaGuiComponent } from 'src/app/components/ns-tuyen-dung/mail-da-gui/mail-da-gui.component';
import { NsCauHinhComponent } from 'src/app/components/ns-tuyen-dung/ns-cau-hinh/ns-cau-hinh.component';
import { KeHoachTuyenDungComponent } from 'src/app/components/ke-hoach-tuyen-dung/ke-hoach-tuyen-dung.component';
import { ImportKeHoachComponent } from 'src/app/components/ke-hoach-tuyen-dung/import-ke-hoach/import-ke-hoach.component';
import { ChiTietKeHoachTuyenDungComponent } from 'src/app/components/ke-hoach-tuyen-dung/chi-tiet-ke-hoach-tuyen-dung/chi-tiet-ke-hoach-tuyen-dung.component';
import { ImportLinhVucTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/linh-vuc-tuyen-dung/import-linh-vuc-tuyen-dung/import-linh-vuc-tuyen-dung.component';
import { ImportExcelComponent } from 'src/app/common/import-excel/import-excel.component';

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
    path: 'ds-tuyen-dung/import',
    component: ImportTuyenDungComponent,
    data: {
      title: 'Import tuyển dụng',
      url: 'import-tuyen-dung',
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
    path: 'ke-hoach-tuyen-dung/import',
    component: ImportKeHoachComponent,
    data: {
      title: 'Import kế hoạch tuyển dụng',
      url: 'import',
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
      title: 'Danh sách Chuyên môn tuyển dụng',
      url: 'chuyen-mon',
    },
  },
  {
    path: 'chuyen-mon/import-chuyen-mon',
    component: ImportExcelComponent,
    data: {
      title: 'Import chuyên môn',
      url: 'import-chuyen-mon',
      titleDad : 'Danh sách Chuyên môn tuyển dụng',
      urlDad: '/tuyen-dung/chuyen-mon',
      api: 'setJobImport',
      apiAccept: 'setJobAccept',
      fileDoc: 'file_mau_import_danh_muc_chuyen_mon.xls',
      apiExport: 'setJobExportDraft'
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
  {
    path: 'cau-hinh',
    component: NsCauHinhComponent,
    data: {
      title: 'Cấu hình',
      url: 'cau-hinh',
    },
  },
  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TuyenDungRoutingModule { }




