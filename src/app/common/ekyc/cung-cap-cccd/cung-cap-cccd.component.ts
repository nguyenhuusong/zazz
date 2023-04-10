import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
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
  identityImage = {
    back: null,
    front: null
  };
  private readonly unsubscribe$: Subject<void> = new Subject();
  imgDefault = '../../../assets/images/account/dang-ky/image-cmnd.svg';
  imgDefaultMs = '../../../assets/images/account/dang-ky/image-cmnd-sau.svg';
  imageMt = null;
  imageMs = null;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
  }

  stepBack(): void {
    this.stepActive.emit({ key: 0, data: null });
  }

  stepNext(): void {
    if (!this.imageMt || !this.imageMs) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng chọn ảnh chứng minh/ CCCD!' });
      return;
    }
    this.spinner.show();
    this.apiService.detectByidCard({
      frontImage: this.imageMt.split(',')[1], backImage: this.imageMs.split(',')[1]
    }).subscribe(results => {
      if (results.status === 200) {
        const params: ConfirmCard = {
          idCardType: this.DoccumentCCCD.indexOf(results.data.document) ? 'CITIZEN_ID_CARD' : 'ID_CARD',
          idCardNumber: results.data.no,
          fullName: results.data.name,
          birthday: results.data.birthday,
          sex: results.data.sex === 'Nam' ? 'MALE' : 'FEMALE',
          nationality: 234,
          address: results.data.address,
          contactAddress: results.data.hometown,
          expiry: results.data.expiry,
          issueDate: results.data.issueDate,
          issueBy: results.data.issueBy
        };
        this.stepActive.emit({
          key: 2, data: {
            thongtinEKYC: params,
            identityImage: this.identityImage
          }
        });
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật CMND/CCCD thành công' });
      } else {
        this.messageService.add({ severity: 'error', icon: 'pi-file', summary: 'Thông báo', detail: 'Ảnh không hợp lệ'});
      }
      this.spinner.hide();
    }, error => {
      console.error(error);
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Cập nhật CMND/CCCD không hợp lệ' });
      this.spinner.hide();
    });
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
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onUploadMt(event) {
    if (event.files && event.files[0]) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageMt = reader.result;
      console.log(this.imageMt);
      reader.readAsDataURL(file);
      this.identityImage.front = file;
    }
  }
  onUploadMs(event) {
    if (event.files && event.files[0]) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageMs = reader.result;
      console.log(this.imageMs);
      reader.readAsDataURL(file);
      this.identityImage.front = file;
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

