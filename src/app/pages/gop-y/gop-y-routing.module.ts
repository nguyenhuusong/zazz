import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GopYKienComponent } from 'src/app/components/gop-y-kien/gop-y-kien.component';
import { ChiTietGopYComponent } from 'src/app/components/gop-y-kien/chi-tiet-gop-y/chi-tiet-gop-y.component';

const routes: Routes = [
  {
    path: '',
    component: GopYKienComponent,
    data: {
      title: 'Góp ý',
      url: 'gop-y',
    },
  },
  {
    path: 'chi-tiet-gop-y',
    component: ChiTietGopYComponent,
    data: {
      title: 'Chi tiết góp ý',
      url: 'chi-tiet-gop-y',
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GopYRoutingModule { }