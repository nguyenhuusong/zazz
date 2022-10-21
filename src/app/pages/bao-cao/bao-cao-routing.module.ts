import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BaoCaoComponent } from 'src/app/components/bao-cao/bao-cao.component';
const routes: Routes = [
  {
   path: 'bao-cao-tong-hop',
   component: BaoCaoComponent,
   data: {
     title: 'Báo cáo tổng hợp',
     url: 'bao-cao-tong-hop',
   },
 },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaoCaoRoutingModule { }




