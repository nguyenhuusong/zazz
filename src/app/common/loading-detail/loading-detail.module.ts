import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingDetailComponent } from './loading-detail.component';
import {SkeletonModule} from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { LoadingGridModule } from '../loading-grid/loading-grid.module';
@NgModule({
    declarations: [
        LoadingDetailComponent,
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
    ],
    providers: []
})
export class LoadingDetailModule {}