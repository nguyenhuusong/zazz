import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingDetailComponent } from './loading-detail.component';
import {SkeletonModule} from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { LoadingGridModule } from '../loading-grid/loading-grid.module';
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
        TableModule,
        LoadingGridModule,
    ],
    entryComponents: [],
    exports: [
        LoadingDetailComponent,
        LoadingFieldComponent
    ],
    providers: []
})
export class LoadingDetailModule {}