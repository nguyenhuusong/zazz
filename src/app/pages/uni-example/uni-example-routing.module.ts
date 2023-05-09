import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { UniExampleComponent } from 'src/app/components/uni-example/uni-example.component';
const routes: Routes = [
  {
    path: '',
    component: UniExampleComponent,
    data: {
      title: '',
      url: '',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniExampleRoutingModule { }




