

import { Component, OnInit, OnChanges, Input, ChangeDetectionStrategy, ViewContainerRef, ViewChild, SimpleChanges } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalNodeComponent } from '../modal-node/modal-node.component';
import { NodeService } from '../node.service';



@Component({
  selector: 'app-node-container',
  templateUrl: './node-container.component.html',
  styleUrls: ['./node-container.component.scss']
})
export class NodeContainerComponent implements OnInit, OnChanges {
  @Input() nodes = [];

  @Input() connections = [];
  @ViewChild('nodes', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;
  ref: DynamicDialogRef;

  constructor(private nodeService: NodeService, public dialogService: DialogService) { }
  ngOnChanges(changes: SimpleChanges): void {
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
  ngOnInit() {
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
    type: ''
  }
  addNode() {
    this.modelAddNode = {
      title: 'dd',
      type: ''
    }
    this.displayAdd = true;

  }

  saveNode() {
    const node = { id: "Step id_" + [Math.random().toString(16).slice(2, 8)], ...this.modelAddNode };
    this.nodeService.addDynamicNode(node);
  }

  saveNodeJson() {
    //save element position on Canvas and node conections

    const container = this.viewContainerRef.element.nativeElement.parentNode;
    const nodes = Array.from(container.querySelectorAll('.node')).map((node: HTMLDivElement) => {
      return {
        id: node.id,
        title: node.title,
        type: "",
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