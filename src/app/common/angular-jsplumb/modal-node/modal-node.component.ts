import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-node',
  templateUrl: './modal-node.component.html',
  styleUrls: ['./modal-node.component.scss']
})
export class ModalNodeComponent implements OnInit {
  @Input() modelAddNode = {
    title: '',
    typeNode: ''
  }
  constructor(public ref: DynamicDialogRef) {}

  ngOnInit(): void {
    this.ref.onDragStart.subscribe(ressult => {
      console.log(ressult)
    })
  }

  saveNode() {
    this.ref.close(this.modelAddNode);
  }

}
