import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TreeModule} from 'primeng/tree';

import { AddMediaComponent } from './add-media/add-media.component';
import { MediaListComponent } from './media-list/media-list.component';
import {ContextMenuModule} from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'src/app/shared/shared.module';
import {DialogModule} from 'primeng/dialog';
@NgModule({
  declarations: [AddMediaComponent, MediaListComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CommonModule,
        RouterModule,
        
        TreeModule,
        ButtonModule,
        ContextMenuModule,
        DialogModule
    ],
  exports: [
    MediaListComponent
  ],
  entryComponents : [
      AddMediaComponent,
      MediaListComponent
  ],
  providers: [
  ]
})
export class ManageMediaModule { }
