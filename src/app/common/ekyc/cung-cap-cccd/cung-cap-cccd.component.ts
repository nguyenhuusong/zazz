import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import * as queryString from 'querystring';
@Component({
  selector: 'app-cung-cap-cccd',
  templateUrl: './cung-cap-cccd.component.html',
  styleUrls: ['./cung-cap-cccd.component.scss']
})
export class CungCapCccdComponent implements OnInit, OnDestroy {
  DoccumentCMND = ['OLD ID', 'OLD DOCUMENT'];
  DoccumentCCCD = ['CCCD', 'NEW CCCD', 'CHIP ID'];
  @Output() stepActive = new EventEmitter<any>();
  @Output() callback = new EventEmitter<any>();
  @Input() information = null;
  @Input() canId = null;
  @Input() custId = null;
  @Input() isCanId: boolean = true;
  identityImage = {
    back: null,
    front: null,
    canId: null,
    idcard_type: 1
  };

  private readonly unsubscribe$: Subject<void> = new Subject();
  imgDefault = '/assets/images/account/image-cmnd/svg';
  imgDefaultMs = '../../../assets/images/account/image-cmnd-sau.svg';
  imageMt = null;
  imageMs = null;
  typeCards = [];
  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getObjectsIdCard()
  }

  getObjectsIdCard() {
    this.apiService.getObjects(queryString.stringify({ objKey: 'idCard_type_group' })).subscribe(results => {
      if(results.status === 'success') {
          this.typeCards = results.data;
      }
    })
  }

  stepBack(): void {
    this.stepActive.emit({ key: 0, data: null });
  }

  stepNext(): void {
    if ((this.identityImage.idcard_type == 1 || this.identityImage.idcard_type == 2) && (!this.imageMt || !this.imageMs)) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng chọn ảnh chứng minh/ CCCD!' });
      return;
    }

    if ((this.identityImage.idcard_type == 3) && (!this.imageMt)) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui Lòng tải lên hộ chiếu' });
      return;
    }
    if(this.isCanId) {
      const formData =new FormData();
      formData.append('formFile1', this.identityImage.front)
      formData.append('formFile2', this.identityImage.back)
      formData.append('idcard_type', this.identityImage.idcard_type.toString())
      formData.append('canId', this.canId);
      this.spinner.show();
      this.apiService.setCustFromCanId(formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        console.log(results)
        if (results.status === 'success') {
            this.callback.emit(results.data.custId);
            this.messageService.add({
              severity: 'success', summary: 'Thông báo', detail: results.data.messages
            });
            this.spinner.hide();
        }else {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error', summary: 'Thông báo', detail: results.message
          });
        }
      })
    }else {
      const formData =new FormData();
      formData.append('formFile1', this.identityImage.front)
      formData.append('formFile2', this.identityImage.back)
      formData.append('idcard_type', this.identityImage.idcard_type.toString())
      formData.append('custId', this.custId);
      this.spinner.show();
      this.apiService.setCustFromId(formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((results: any) => {
        console.log(results)
        if (results.status === 'success') {
            this.callback.emit(results.data.custId);
            this.messageService.add({
              severity: 'success', summary: 'Thông báo', detail: results.data.messages
            });
            this.spinner.hide();
        }else {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error', summary: 'Thông báo', detail: results.message
          });
        }
      })
    }
    


  }


  uploadMtCm(event, type): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageMt = reader.result;
      reader.readAsDataURL(file);
      this.identityImage.front = file;
    }
  }

  uploadMsCm(event, type): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageMs = reader.result;
      reader.readAsDataURL(file);
      this.identityImage.back = file;
    }
  }

  ngOnDestroy(): void {
    // this.unsubscribe$.next();
    // this.unsubscribe$.complete();
  }

    // if (event.currentFiles[0] && event.currentFiles[0].size > 0) {
    //   const getDAte = new Date();
    //   const getTime = getDAte.getTime();
    //   const storageRef = firebase.storage().ref();
    //   const uploadTask = storageRef.child(`s-hrm/file-attach/${getTime}-${event.currentFiles[0].name})`).put(event.currentFiles[0]);
    //   uploadTask.on('state_changed', (snapshot) => {
    //   }, (error) => {
    //     this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: error.message });
    //     this.spinner.hide();


  onUploadMt(event) {
    if (event.currentFiles[0] && event.currentFiles[0].size > 0) {
      const file = event.currentFiles[0];
      const reader = new FileReader();
      reader.onload = e => this.imageMt = reader.result;
      console.log(this.imageMt);
      reader.readAsDataURL(file);
      this.identityImage.front = file;
    }
  }
  onUploadMs(event) {
    if (event.currentFiles[0] && event.currentFiles[0].size > 0) {
      const file = event.currentFiles[0];
      const reader = new FileReader();
      reader.onload = e => this.imageMs = reader.result;
      reader.readAsDataURL(file);
      this.identityImage.back = file;
    }
  }
}

export interface ConfirmCard {
  idCardType: string,
  idCardNumber: string,
  fullName: string,
  birthday: string,
  sex: string,
  nationality: number,
  address: string,
  contactAddress: string,
  expiry: string,
  issueDate: string,
  issueBy: string
}

