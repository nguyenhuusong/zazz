import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PageNotifyComponent } from './page-notify.component';
import { NotifyDetailComponent } from './notify-detail/notify-detail.component';
import { PageLoaiThongBaoComponent } from './page-loai-thong-bao/page-loai-thong-bao.component';
import { ChiTietLoaiThongBaoComponent } from './page-loai-thong-bao/chi-tiet-loai-thong-bao/chi-tiet-loai-thong-bao.component';
import { PageMauThongBaoComponent } from './page-mau-thong-bao/page-mau-thong-bao.component';
import { ChiTietMauThongBaoBaoModule } from './page-mau-thong-bao/chi-tiet-mau-thong-bao/chi-tiet-mau-thong-bao.module';
import { ChiTietMauThongBaoComponent } from './page-mau-thong-bao/chi-tiet-mau-thong-bao/chi-tiet-mau-thong-bao.component';
const routes: Routes = [
  // { path: '', component: PageNotifyComponent },

  {
    path: '',
    data: {
      title: 'Danh sách thông báo'
    },
    children: [
      {
        path: "",
        redirectTo: "danh-sach-thong-bao",
        pathMatch: 'full'
      },
      {
        path: 'danh-sach-thong-bao',
        component: PageNotifyComponent,
        data: {
          title: 'Danh sách thông báo'
        }
      },
      {
        path: 'them-moi-thong-bao',
        component: NotifyDetailComponent,
        data: {
          title: 'Thêm mới thông báo'
        }
      },
      {
        path: 'chi-tiet-gioi-thieu-du-an',
        component: NotifyDetailComponent,
        data: {
          title: 'Chi tiết thông báo'
        }
      },

      // Loại thông báo
      {
        path: 'loai-thong-bao',
        component: PageLoaiThongBaoComponent,
        data: {
          title: 'Danh sách loại thông báo'
        }
      },
      {
        path: 'loai-thong-bao/them-moi-loai-thong-bao',
        component: ChiTietLoaiThongBaoComponent,
        data: {
          title: 'Thêm mới loại thông báo',
          url: 'them-moi-loai-thong-bao'
        }
      },
      {
        path: 'loai-thong-bao/chi-tiet-loai-thong-bao',
        component: ChiTietLoaiThongBaoComponent,
        data: {
          title: 'Chi tiết loại thông báo',
          url: 'chi-tiet-loai-thong-bao'
        }
      },

      // Mẫu thông báo
      {
        path: 'mau-thong-bao',
        component: PageMauThongBaoComponent,
        data: {
          title: 'Danh sách mẫu thông báo'
        }
      },
      {
        path: 'mau-thong-bao/them-moi-mau-thong-bao',
        component: ChiTietMauThongBaoComponent,
        data: {
          title: 'Thêm mới mẫu thông báo',
          url: 'them-moi-mau-thong-bao'
        }
      },
      {
        path: 'mau-thong-bao/chi-tiet-mau-thong-bao',
        component: ChiTietMauThongBaoComponent,
        data: {
          title: 'Chi tiết mẫu thông báo',
          url: 'chi-tiet-mau-thong-bao'
        }
      },
    ],
  }



];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageNotifyRoutingModule { }
