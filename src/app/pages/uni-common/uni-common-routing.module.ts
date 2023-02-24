import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UniCommonComponent } from 'src/app/components/uni-common/uni-common.component';
const routes: Routes = [
  {
   path: 'uni-common',
   component: UniCommonComponent,
   data: {
     title: 'Danh sách icon',
     url: 'uni-icons',
   },
 },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniCommonRoutingModule { }




