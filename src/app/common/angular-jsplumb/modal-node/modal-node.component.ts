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
      console.log(this.ref)
  }

  saveNode() {
    this.ref.close(this.modelAddNode);
  }

}
