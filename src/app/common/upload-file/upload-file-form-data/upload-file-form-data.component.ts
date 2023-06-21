import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as firebase from 'firebase';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-upload-file-form-data',
  templateUrl: './upload-file-form-data.component.html',
  styleUrls: ['./upload-file-form-data.component.scss']
})
export class UploadFileFormDataComponent implements OnInit {
  @Input() multiple = false;
  @Input() maxFileSize = 12000000;
  @Input() isDialog = false;
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
    this.handleUpload(event.currentFiles)
    
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

  handleUpload(event) {
    const file = event[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const params = {
          type: event.type,
          size: event.size,
          name: event.name,
          url: reader.result,
          file: event[0]
        }
        this.listAttach.push(params);
    };
}

  onSubmitUpload() {
    console.log("this.listAttach",this.listAttach)
    if(this.listAttach.length > 0) {
      this.callback.emit(this.listAttach);
    }else {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Bạn chưa tải file lên. Vui lòng chọn file cần tải!' });
    }
    // this.c
  }

}
