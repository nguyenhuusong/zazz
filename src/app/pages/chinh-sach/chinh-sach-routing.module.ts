import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NsTuyenDungComponent } from 'src/app/components/ns-tuyen-dung/ns-tuyen-dung.component';
import { CsNghiPhepComponent } from 'src/app/components/cs-nghi-phep/cs-nghi-phep.component';
import { CsChamCongComponent } from 'src/app/components/cs-cham-cong/cs-cham-cong.component';
import { CsAnCaComponent } from 'src/app/components/cs-an-ca/cs-an-ca.component';
import { CsTienLuongComponent } from 'src/app/components/cs-tien-luong/cs-tien-luong.component';
import { CsThueThuNhapComponent } from 'src/app/components/cs-thue-thu-nhap/cs-thue-thu-nhap.component';

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
//nghỉ phép
{
  path: 'nghi-phep',
  component: CsNghiPhepComponent,
  data: {
    title: 'Danh sách nghỉ phép',
    url: 'nghi-phep',
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