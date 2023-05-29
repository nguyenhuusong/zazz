import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as firebase from 'firebase';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  @Input() multiple = false;
  @Input() maxFileSize = 12000000
  @Output() callback = new EventEmitter<any>();
  constructor(
    private spinner: NgxSpinnerService,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
  }

  modelUpload = {
    type: '',
    size: 0,
    name: '',
    url: ''
  }
  listAttach = [];
  uploadFn(event) {
    this.listAttach = [];
    if (event.currentFiles.length > 0) {
      for (let file of event.currentFiles) {
        const params = {
          type: file.type,
          size: file.size,
          name: file.name,
          url: '',
          file: file
        }
        this.listAttach.push(params);
      }
    }
    else{
      this.spinner.hide();
    }

    // thêm chức danh



    // if (event.currentFiles[0] && event.currentFiles[0].size > 0) {
    //   const getDAte = new Date();
    //   const getTime = getDAte.getTime();
    //   const storageRef = firebase.storage().ref();
    //   const uploadTask = storageRef.child(`s-hrm/file-attach/${getTime}-${event.currentFiles[0].name})`).put(event.currentFiles[0]);
    //   uploadTask.on('state_changed', (snapshot) => {
    //   }, (error) => {
    //     this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.message });
    //     this.spinner.hide();
    //   }, () => {
    //     uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
    //       if (downloadURL) {
    //           this.modelUpload.type = event.currentFiles[0].type;
    //           this.modelUpload.size = event.currentFiles[0].size;
    //           this.modelUpload.name = event.currentFiles[0].name;
    //           this.modelUpload.url = event.currentFiles[0].url;

    //         // const indexobj = this.listsData[3].findIndex(d => d.source_id === this.record.source_id);
    //         // let record = { ... this.listsData[3][indexobj] };
    //         // record.meta_file_url = downloadURL;
    //         // record.meta_file_type = event.currentFiles[0].type;
    //         // record.meta_file_size = event.currentFiles[0].size;
    //         // record.meta_file_name = event.currentFiles[0].name;
    //         // this.listsData[3][indexobj] = record;
    //         // this.listsData[3] = [... this.listsData[3]];
    //         // this.listViewsRecordInfo.records = this.listsData[3]
    //         // this.displayuploadcontract = false;
    //         this.spinner.hide();
    //       }
    //     });
    //   });
    // }
  }

  onSubmitUpload() {
    this.callback.emit(this.listAttach);
    // this.c
  }

}
