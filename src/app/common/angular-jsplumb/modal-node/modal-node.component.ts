import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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
  constructor() {}

  ngOnInit(): void {
  }

}
