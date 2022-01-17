import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NsTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/ns-tuyen-dung.component';
import { CsNghiPhepComponent } from 'src/app/components/cs-nghi-phep/cs-nghi-phep.component';
import { CsChamCongComponent } from 'src/app/components/cs-cham-cong/cs-cham-cong.component';
import { CsAnCaComponent } from 'src/app/components/cs-an-ca/cs-an-ca.component';
import { CsTienLuongComponent } from 'src/app/components/cs-tien-luong/cs-tien-luong.component';
import { CsThueThuNhapComponent } from 'src/app/components/cs-thue-thu-nhap/cs-thue-thu-nhap.component';
import { ChiTietNghiPhepComponent } from 'src/app/components/cs-nghi-phep/chi-tiet-nghi-phep/chi-tiet-nghi-phep.component';
import { ChiTietAnCaComponent } from 'src/app/components/cs-an-ca/chi-tiet-an-ca/chi-tiet-an-ca.component';
import { ChiTietChamCongComponent } from 'src/app/components/cs-cham-cong/chi-tiet-cham-cong/chi-tiet-cham-cong.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "cham-cong",
    pathMatch: 'full'
  },
  //Chấm công
  {
    path: 'cham-cong',
    component: CsChamCongComponent,
    data: {
      title: 'Danh sách chấm công',
      url: 'cham-cong',
    },
  },
  {
    path: 'cham-cong/chi-tiet-cham-cong',
    component: ChiTietChamCongComponent,
    data: {
      title: 'Chi tiết chấm công',
      url: 'chi-tiet-cham-cong',
    },
  },
//nghỉ phép
{
  path: 'nghi-phep',
  component: CsNghiPhepComponent,
  data: {
    title: 'Danh sách nghỉ phép',
    url: 'nghi-phep',
  },
},
{
  path: 'nghi-phep/chi-tiet-nghi-phep',
  component: ChiTietNghiPhepComponent,
  data: {
    title: 'Chi tiết nghỉ phép',
    url: 'nghi-phep/chi-tiet-nghi-phep',
  },
},


//tăng ca
{
  path: 'an-ca',
  component: CsAnCaComponent,
  data: {
    title: 'Danh sách ăn ca',
    url: 'an-ca',
  },
},
{
  path: 'an-ca/chi-tiet-an-ca',
  component: ChiTietAnCaComponent,
  data: {
    title: 'Chi tiết ăn ca',
    url: 'chi-tiet-an-ca',
  },
},

//Tiền lương
{
  path: 'tien-luong',
  component: CsTienLuongComponent,
  data: {
    title: 'Danh sách tiền lương',
    url: 'tien-luong',
  },
},
 //Thuế thu nhập
{
  path: 'thue-thu-nhap',
  component: CsThueThuNhapComponent,
  data: {
    title: 'Danh sách thuế thu nhập',
    url: 'thue-thu-nhap',
  },
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChinhSachRoutingModule { }