import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CsChamCongComponent } from 'src/app/components/cs-cham-cong/cs-cham-cong.component';
import { ChiTietChamCongComponent } from 'src/app/components/cs-cham-cong/chi-tiet-cham-cong/chi-tiet-cham-cong.component';

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
      title: 'Danh sách chấm công',
      url: 'thong-bao',
    },
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaiDatRoutingModule { }