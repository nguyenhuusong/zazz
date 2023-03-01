import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import * as queryString from 'querystring';
import { cloneDeep } from 'lodash';
import * as firebase from 'firebase';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-emp-attach-file',
  templateUrl: './emp-attach-file.component.html',
  styleUrls: ['./emp-attach-file.component.css']
})
export class EmpAttachFileComponent implements OnInit {
  @Input() modelAttach = null
  @Output() callback = new EventEmitter<any>();
  @Output() back = new EventEmitter<any>();
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
  ) { }
  listViews = [];
  detailInfo= null
  note = ''
  files = null
  ngOnInit(): void {
    this.getContractInfo();
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getContractInfo() {
    this.listViews  = []
    this.spinner.show();
    const queryParams = queryString.stringify(this.modelAttach);
    this.apiService.getEmpAttach(queryParams)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.detailInfo = results.data;
        this.spinner.hide();
      }
    })
  }
  theData = []
  setUploadFile(data) {
    // if (this.downloadURL) {
      // data[0].fields.forEach(element => {
      //   if(element.field_name === "meta_file_url"){
      //     element.columnValue = this.downloadURL;
      //   }else if(element.field_name === "meta_title"){
      //     element.columnValue = this.note
      //   }else if(element.columnType === "meta_file_name"){
      //     element.columnValue = this.theFileUploaded.name
      //   }else if(element.columnType === "meta_file_type"){
      //     element.columnValue = this.theFileUploaded.type
      //   }else if(element.columnType === "meta_file_size"){
      //     element.columnValue = this.theFileUploaded.size
      //   }
      // });
      // this.theData = data;
      if(this.files && this.files.length > 0){
        data[0].fields.forEach(element => {
          if(element.field_name === "meta_file_size") {
            element.columnValue = this.files[0].size
          }else if(element.field_name === "meta_file_type") {
            element.columnValue = this.files[0].type;
          }
          else if(element.field_name === "meta_file_name") {
            element.columnValue = this.files[0].name;
          }
        });
      }
      const params = {
        ...this.detailInfo, group_fields: data
      }
      this.spinner.show();
      this.apiService.setEmpAttach(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        if(results.status === 'success') {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data: 'Thêm mới file đình kèm thành công !'});
          this.callback.emit();
          this.spinner.hide();
        }else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message});
          this.spinner.hide();
        }
      })
    // }else{
    //   this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Chưa upload file'});
    // }
  }

  removeImage() {
    this.uploadedFiles = []
    this.downloadURL = ''
    this.theData[0].fields.forEach(element => {
      if(element.field_name === "meta_file_url"){
        element.columnValue = '';
      }else if(element.field_name === "meta_title"){
        element.columnValue = ''
      }
    });
  }
  
  uploadedFiles: any[] = [];
  downloadURL = '';
  theFileUploaded = null
  uploadHandler(event) {
      for(let file of event.files) {
          this.uploadedFiles.push(file);
      }
      // this.spinner.show();
      if (event.currentFiles[0] && event.currentFiles[0].size > 0) {
        const getDAte = new Date();
        const getTime = getDAte.getTime();
        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(`ksbond/images/${getTime}-${event.currentFiles[0].name}`).put(event.currentFiles[0]);
        uploadTask.on('state_changed', (snapshot) => {
        }, (error) => {
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.downloadURL = downloadURL;
            this.theFileUploaded = event.currentFiles[0]
          }).catch(error => {
            this.spinner.hide();
          });
        });
    }
  }

  getFilesDetail(event) {
    this.files = event;
  }

  huy() {
    this.back.emit();
  }
}
