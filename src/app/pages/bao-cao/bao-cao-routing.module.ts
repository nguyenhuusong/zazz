import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BaoCaoComponent } from 'src/app/components/bao-cao/bao-cao.component';
import { BaoCaoTuyenDungComponent } from 'src/app/components/bao-cao/bao-cao-tuyen-dung/lich-su-tuyen-dung/bao-cao-tuyen-dung.component';
const routes: Routes = [
  // {
  //   path: 'bao-cao-tong-hop',
  //   component: BaoCaoComponent,
  //   data: {
  //     title: 'Báo cáo tổng hợp',
  //     url: 'bao-cao-tong-hop',
  //   },
  // },
  {
    path: 'tuyen-dung',
    component: BaoCaoTuyenDungComponent,
    data: {
      title: 'Báo cáo tuyển dụng',
      url: 'tuyen-dung',
      type: 1
    },
  },
  {
    path: 'thong-tin-nhan-su',
    component: BaoCaoTuyenDungComponent,
    data: {
      title: 'Báo cáo thông tin nhân sự',
      url: 'thong-tin-nhan-su',
      type: 2
    },
  },
  {
    path: 'thue-bao-hiem',
    component: BaoCaoTuyenDungComponent,
    data: {
      title: 'Báo cáo thuế và bảo hiểm',
      url: 'thue-bao-hiem',
      type: 3
    },
  },
  {
    path: 'cham-cong-luong',
    component: BaoCaoTuyenDungComponent,
    data: {
      title: 'Báo cáo chấm công và lương',
      url: 'cham-cong-luong',
      type: 4
    },
  },
  {
    path: 'bao-cao-tong-hop',
    component: BaoCaoTuyenDungComponent,
    data: {
      title: 'Báo cáo tổng hợp',
      url: 'bao-cao-tong-hop',
      type: 5
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaoCaoRoutingModule { }




