import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as queryString from 'querystring';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as firebase from 'firebase';
import { ApiCoreService } from 'src/app/services/api-core/apicore.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnChanges {
  manhinh = 'View';
  indexTab = 0;
  optionsButtonsView = [{ label: 'Sửa', value: 'Edit' }, { label: 'Quay lại', value: 'Back' }, { label: 'Xác minh chứng minh thư', value: 'Approved', disabled: true }];
  constructor(
    private apiService: ApiCoreService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }
  @Input() keyName = '';
  @Input() isDialog: boolean = false;
  @Output() back = new EventEmitter<any>();

  user_id = null
  listViews = []
  imagesUrl = []
  paramsObject = null
  displayUserInfo = false
  titleForm = {
    label: 'Cập nhật thông tin khách hàng',
    value: 'Edit'
  }
  ngOnInit(): void {
    if (!this.isDialog) {
      this.handleParams();
    }
  }

  private readonly unsubscribe$: Subject<void> = new Subject();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges() {

    this.user_id = this.keyName;
    this.manhinh = 'Edit';
    this.getProfileInfo();
  }

  handleParams() {
    this.activatedRoute.queryParamMap
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.user_id = this.paramsObject.params.loginName;
      this.manhinh = this.paramsObject.params.type;
      this.getProfileInfo();
    });
  };
  detailInfo = null;
  getProfileInfo() {
    this.listViews = [];
    const queryParams = queryString.stringify({ loginName: this.user_id });
    this.apiService.getProfileInfo(queryParams)
     .pipe(takeUntil(this.unsubscribe$))
     .subscribe(results => {
      if (results.status === 'success') {
        this.detailInfo = results.data;
        this.listViews = cloneDeep(results.data.group_fields);
        if (this.detailInfo.idcard_ready) {
          this.optionsButtonsView[2].disabled = false;
        }
      }
    })
  }

  chinhsua() {
    this.displayUserInfo = true;
    this.titleForm = {
      label: 'Cập nhật thông tin khách hàng',
      value: 'Edit'
    }
    this.getProfileInfo();
  }

  handleChange(index) {
    this.indexTab = index;
  }

  saveUserInfo(data) {
    const params = {
      ...this.detailInfo, group_fields: data
    };
    this.apiService.setProfileInfo(params)
     .pipe(takeUntil(this.unsubscribe$))
     .subscribe((results: any) => {
      if (results.status === 'success') {
        this.displayUserInfo = false;
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công' });
        this.back.emit();
      } else {
        this.messageService.add({
          severity: 'error', summary: 'Thông báo', detail: results.message
        });
      }
    }, error => {
    });
  }


  onChangeButtonView(event) {
    if (event.value === 'Approved') {
      this.confirmationService.confirm({
        message: 'Bạn muốn xác minh thông tin chứng minh thư là đúng ?',
        accept: () => {
          this.apiService.setProfileIdcardVerify({ loginName: this.detailInfo.loginName })
           .pipe(takeUntil(this.unsubscribe$))
           .subscribe(results => {
            if (results.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Thông tin đã được xác minh thành công' });
              this.manhinh = 'Edit';
              this.getProfileInfo();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message });
            }
          })
        }
      });
    } else {
      this.getProfileInfo();
      this.manhinh = event.value;
      if (event.value === 'Back') {
        this.goBack();
      }
    }
  }

  goBack() {
    if (!this.isDialog) {
      this.router.navigate(['/page-user']);
    }
  }

  cancelUpdate() {
    this.back.emit();
    this.getProfileInfo();
  }

  indexdocType = 0
  indexMeta = 0
  updateImage(event, index, indexChild) {
    this.indexdocType = index;
    this.indexMeta = indexChild;
  }

  onUploadOutputImage(event, index, indexChild) {
    if (event.target.files && event.target.files[0] && event.target.files[0].size > 0) {
      const getDAte = new Date();
      const getTime = getDAte.getTime();
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(`housing/images/${getTime}-${event.target.files[0].name}`).put(event.target.files[0]);
      uploadTask.on('state_changed', (snapshot) => {
      }, (error) => {
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          if (downloadURL) {
            // this.notificationService.showNotification('Upload ảnh thành công', 1);
            const data = {
              doc_sub_type: this.detailInfo.doc_types[this.indexdocType].metas[this.indexMeta].doc_sub_type,
              doc_sub_type_name: this.detailInfo.doc_types[this.indexdocType].metas[this.indexMeta].doc_sub_type_name,
              doc_type: this.detailInfo.doc_types[this.indexdocType].metas[this.indexMeta].doc_type,
              metaId: this.detailInfo.doc_types[this.indexdocType].metas[this.indexMeta].metaId,
              metaName: event.target.files[0].name,
              metaNote: event.target.files[0].metaNote,
              metaUrl: downloadURL,
              metatype: event.target.files[0].type,
            }
            this.detailInfo.doc_types[this.indexdocType].metas[this.indexMeta] = data;
            this.detailInfo.doc_types = [...this.detailInfo.doc_types]
            this.saveUserInfo(this.detailInfo.group_fields);
          }
        });
      });
    }
  }

  deleteAvatar(indexParent, indexChild) {
    const meta = {
      doc_sub_type: this.detailInfo.doc_types[indexParent].metas[indexChild].doc_sub_type,
      doc_sub_type_name: this.detailInfo.doc_types[indexParent].metas[indexChild].doc_sub_type_name,
      doc_type: this.detailInfo.doc_types[indexParent].metas[indexChild].doc_type,
      metaId: this.detailInfo.doc_types[indexParent].metas[indexChild].metaId,
      metaName: '',
      metaNote: null,
      metaUrl: '',
      metatype: '',
    }
    this.detailInfo.doc_types[indexParent].metas[indexChild] = meta;
    this.detailInfo.doc_types[indexParent].metas = [...this.detailInfo.doc_types[indexParent].metas];
    this.saveUserInfo(this.detailInfo.group_fields);
  }

  imageDetail = null;
  displayViewImage = false;
  ViewImage(event, image) {
    this.imageDetail = image;
    this.displayViewImage = true
  }


}
