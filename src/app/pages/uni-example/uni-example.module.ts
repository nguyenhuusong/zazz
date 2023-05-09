import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UniExampleRoutingModule } from './uni-example-routing.module';
import { TabViewModule } from 'primeng/tabview';
import { UniExampleComponent } from 'src/app/components/uni-example/uni-example.component';
import { UniIconComponent } from 'src/app/components/uni-example/icon/uni-icon.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    UniExampleRoutingModule,
    TabViewModule
  ],

  declarations: [
    UniExampleComponent,
    UniIconComponent
  ],
  providers: [ ]
})
export class UniExampleModule { }