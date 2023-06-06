import {
    ComponentRef,
    ComponentFactoryResolver,
    Injectable,
    Inject,
    ReflectiveInjector,
    ViewChild,
    ViewContainerRef
  } from '@angular/core';
  import { jsPlumb } from 'jsplumb';
import { NodeComponent, Node } from './node/node.component';
  
  
  @Injectable()
  export class NodeService {
    @ViewChild('nodeContainer', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;
    private rootViewContainer: any;
  
    jsPlumbInstance = jsPlumb.getInstance(); 
  
    constructor(private factoryResolver: ComponentFactoryResolver) { }
  
    public setRootViewContainerRef(viewContainerRef) {
      this.rootViewContainer = viewContainerRef;
    }
  
    public addDynamicNode(node: Node) {
        console.log(this.viewContainerRef)
      const factory = this.factoryResolver.resolveComponentFactory(NodeComponent);
      const component = factory.create(this.rootViewContainer.parentInjector);
      (<any>component.instance).node = node;
      (<any>component.instance).jsPlumbInstance = this.jsPlumbInstance;
      this.rootViewContainer.insert(component.hostView);
      console.log("in NodeService.." , component.instance );
    }
   
    addConnection(connection) {
      this.jsPlumbInstance.connect({ uuids: connection.uuids });
    }
  
    public clear() {
      this.rootViewContainer.clear();
    }
  }
  
  