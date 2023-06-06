
import { Component, Input, AfterViewInit } from '@angular/core';
import { jsPlumb } from 'jsplumb';

export interface Node {
  id: string;
  title: string;
  type?: string;
  top?: number;
  left?: number;
}

@Component({
  selector: 'node',
  template: `
  <div class="node" (dblclick)="editNode(node)" id="{{node.id}}" data-title="{{node.title}}"  [style.top.px]="node.top || 0" [style.left.px]="node.left || 20">{{node.title}}<i  class="pi pi-times" style="
    position: absolute;
    right: -8px;
    top: -8px;
    background: #fff;
    padding: 4px;
    border-radius: 100%;
    font-size: 11px;
    box-shadow: 2px 2px 4px #ccc;
    cursor: pointer;
"></i></div>`,
  styles: [
    `.node {position: absolute;width: 150px;height: 50px;
  padding: 4px;box-shadow: 0 10px 40px 0 #B0C1D9;text-align: center;}`,
  ],
})
export class NodeComponent implements AfterViewInit {
  @Input() node: Node;

  @Input() jsPlumbInstance;

  ngAfterViewInit() {
    const exampleDropOptions = {
      tolerance: 'touch',
      hoverClass: 'dropHover',
      activeClass: 'dragActive',
    };
    let Endpoint1 = {
      endpoint: ['Dot', { radius: 7 }],
      paintStyle: { fill: '#99cb3a' },
      isSource: true,
      scope: 'jsPlumb_DefaultScope',
      connectorStyle: { stroke: '#99cb3a', strokeWidth: 1 },
      connector: ['Bezier', { curviness: 63 }],
      maxConnections: 30,
      isTarget: false,
      connectorOverlays: [['Arrow', { location: 1 }]],
      dropOptions: exampleDropOptions,
    };
    let Endpoint2 = {
      endpoint: ['Dot', { radius: 2 }],
      paintStyle: { fill: '#ffcb3a' },
      isSource: false,
      scope: 'jsPlumb_DefaultScope',
      maxConnections: 1,
      isTarget: true,
      dropOptions: exampleDropOptions,
    };
    const { id } = this.node;
    this.jsPlumbInstance.addEndpoint(
      id,
      { anchor: 'Bottom', uuid: id + '_bottom' },
      Endpoint1
    );
    this.jsPlumbInstance.addEndpoint(
      id,
      { anchor: 'Top', uuid: id + '_top' },
      Endpoint2
    );
    this.jsPlumbInstance.addEndpoint(
      id,
      { anchor: 'Right', uuid: id + '_Right' },
      Endpoint2
    );
    this.jsPlumbInstance.addEndpoint(
      id,
      { anchor: 'Left', uuid: id + '_Left' },
      Endpoint2
    );
    
    this.jsPlumbInstance.addEndpoint(
      id,
      { anchor: 'BottomRight', uuid: id + '_BottomRight' },
      Endpoint2
    );
    this.jsPlumbInstance.addEndpoint(
      id,
      { anchor: 'BottomLeft', uuid: id + '_BottomLeft' },
      Endpoint2
    );
    this.jsPlumbInstance.addEndpoint(
      id,
      { anchor: 'TopLeft', uuid: id + '_TopLeft' },
      Endpoint2
    );
    this.jsPlumbInstance.addEndpoint(
      id,
      { anchor: 'Center', uuid: id + '_Center' },
      Endpoint2
    );
    this.jsPlumbInstance.draggable(id);
  }


  removeNode(node) {
    this.jsPlumbInstance.removeAllEndpoints(node.id);
    this.jsPlumbInstance.remove(node.id);
  }

  editNode(node) {
    console.log(this.node)
    // this.simpleModalService
    //   .addModal(DialogComponent, {
    //     title: "Dialog",
    //     questions: { name: node.name, type: node.type }
    //   })
    //   .subscribe(result => {
    //     this.node.name = result.name;
    //     this.node.type = result.type;
    //     if (node.type === "end") {
    //       this.jsPlumbInstance.deleteEndpoint(node.id + "right");
    //     } else {
    //       this.jsPlumbInstance.addEndpoint(
    //         this.node.id,
    //         { anchor: "Right", uuid: this.node.id + "right" },
    //         this.source
    //       );
    //     }
    //   });
  }
}
