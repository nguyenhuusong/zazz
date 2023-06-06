

  import { Component, OnInit, OnChanges, Input, ChangeDetectionStrategy, ViewContainerRef, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalNodeComponent } from '../modal-node/modal-node.component';
import { NodeService } from '../node.service';



@Component({
  selector: 'app-node-container',
  templateUrl: './node-container.component.html',
  styleUrls: ['./node-container.component.scss']
})
export class NodeContainerComponent implements OnInit {
  @Input() nodes = [];

  @Input() connections = [];
  @ViewChild('nodes', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;
  ref: DynamicDialogRef;

  constructor(private nodeService: NodeService, public dialogService: DialogService) {}

  ngOnInit() {
    console.log(this.viewContainerRef)
    this.nodeService.setRootViewContainerRef(this.viewContainerRef);

    this.nodes.forEach(node => {
      this.nodeService.addDynamicNode(node);
    });
    
    setTimeout(() => {
      this.connections.forEach(connection => {
        this.nodeService.addConnection(connection);
      });
    })
  }  
  displayAdd: boolean = false;
  modelAddNode = {
    title: '',
    typeNode: ''
  }
  addNode() {
    this.modelAddNode = {
      title: '',
      typeNode: ''
    }

    this.ref = this.dialogService.open(ModalNodeComponent, {
       data: this.modelAddNode,
        header: 'Thêm tiến trình',
        width: '70%',
        contentStyle: { overflow: 'auto' },
        autoZIndex: true,
        maximizable: true
      });
    this.ref.onClose.subscribe((param: Node) => {
      if (param) {
         console.log(param)

        //  const node = { id: "Step id_"  + [Math.random().toString(16).slice(2, 8)], ...param};
        // this.nodeService.addDynamicNode(node);
      }
  });
  }

  saveNode() {
    
  }

  saveNodeJson(){
    //save element position on Canvas and node conections

    const container = this.viewContainerRef.element.nativeElement.parentNode;
    const nodes = Array.from(container.querySelectorAll('.node')).map((node: HTMLDivElement) => {
      return {
        id: node.id,
        top: node.offsetTop,
        left: node.offsetLeft, 
      }
    });

    const connections = (this.nodeService.jsPlumbInstance.getAllConnections() as any[])
        .map((conn) => ({ uuids: conn.getUuids() }));

    const json = JSON.stringify({ nodes, connections });

    console.log(json);
  }
  
}