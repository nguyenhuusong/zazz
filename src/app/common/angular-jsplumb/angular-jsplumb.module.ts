import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsplumbComponent } from './jsplumb/jsplumb.component';
import { NodeComponent } from './node/node.component';
import { NodeContainerComponent } from './node-container/node-container.component';
import { NodeService } from './node.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalNodeComponent } from './modal-node/modal-node.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';



@NgModule({
  declarations: [
    JsplumbComponent,
    NodeComponent,
    NodeContainerComponent,
    ModalNodeComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicDialogModule
  ],
  exports: [NodeComponent, NodeContainerComponent],
  providers: [NodeService],
  entryComponents: [NodeComponent],
})
export class AngularJsplumbModule { }
