import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingDetailComponent } from './loading-detail.component';
import {SkeletonModule} from 'primeng/skeleton';
import { LoadingFieldComponent } from './loading-field/loading-field.component';
@NgModule({
    declarations: [
        LoadingDetailComponent,
        LoadingFieldComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        SkeletonModule,
    ],
    entryComponents: [],
    exports: [
        LoadingDetailComponent,
        LoadingFieldComponent
    ],
    providers: []
})
export class LoadingDetailModule {}