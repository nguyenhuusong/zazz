import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as queryString from 'querystring'
import { ApiService } from 'src/app/services/api.service';
import { cloneDeep } from 'lodash'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
declare var ace:any;
import showdown from 'showdown';
@Component({
  selector: 'app-notify-detail',
  templateUrl: './notify-detail.component.html',
  styleUrls: ['./notify-detail.component.css']
})
export class NotifyDetailComponent implements OnInit {
  manhinh = 'Edit';
  @Output() save = new EventEmitter<any>();
  indexTab = 0;
  notiId = null;
  tempId = null;
  external_sub = '';
  paramsObject = null;
  dataInfo = null;
  columnDefs = [];
  loading = false;
  titleForm;
  listViews = [];
  converter = new showdown.Converter();
  projectListSelects = [];
  modelMarkdow = {
    type: 1,
    content: '',
    attachs: [],
    attack: true,
    id: 0
  }
  contentTypes = [];
  displaySend = false;
  loadForm = false;
  displayStore = false;
  projects = [];
  constructor(
    private apiService: ApiHrmService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService
  ) { }
  items = [];
  titlePage = ''
  ngOnInit(): void {
    this.titlePage = this.activatedRoute.data['_value'].title;
    this.items = [
      { label: 'Trang chủ' , url: '/home' },
      { label: 'Cài đặt' },
      { label: 'Danh sách thông báo', url: '/cai-dat/thong-bao' },
      { label: `${this.titlePage}` },
    ];
    this.handleParams();
  }

  handleParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
      this.notiId = this.paramsObject.params.notiId;
      this.external_sub = this.paramsObject.params.external_sub;
      this.tempId = this.paramsObject.params.tempId;
      if (this.notiId == null) {
        this.manhinh = 'Edit'
      } else {
        this.manhinh = 'Edit'
      }
      this.modelMarkdow.id = this.notiId
      this.getAppNotifyInfo();
    });
  };

  getAppNotifyInfo() {
    this.listViews = [];
    this.spinner.show();
    const queryParams = queryString.stringify({ n_id: this.notiId, external_sub: this.external_sub, tempId: this.tempId });
    this.apiService.getNotifyInfo(queryParams).subscribe(results => {
      if (results.status === 'success') {
        this.listViews = cloneDeep(results.data.group_fields);
        this.dataInfo = results.data;
        this.external_sub = this.dataInfo.external_sub;
        this.spinner.hide();
      }
    })
  }

  handleChange(index) {
    this.indexTab = index;
  }

  onChangeButtonView(event) {
    this.manhinh = event.value;
    this.getAppNotifyInfo();
  }

  cancelUpload() {
    this.router.navigate(['/cai-dat/thong-bao'])
  }

  displayDsThongBao(data) {
    if (data === 'hide') {
      this.displaySend = false;
    } else {
      this.displaySend = true;
    }
    this.loadForm = false;
  }


  backpageSend() {
    this.displaySend = false;
    this.loadForm = true;
  }

  displayDsCaiDatDS(data) {
    if (data === 'List') {
      // this.save.emit()
      this.router.navigate(['/cai-dat/thong-bao'])
    } else {
      this.getModuleList()
      this.displayStore = true;
      this.loadForm = false;
    }

  }

  backpagestore() {
    this.displayStore = false;
    this.loadForm = true;
  }
  moduleLists = []
  getModuleList() {
    this.apiService.getModuleList().subscribe(results => {
      if (results.status === 'success') {
        const moduleLists = results.data.map(d => {
          return {
            label: `${d.org_name} (${d.org_cd})`,
            value: d.org_cd,
            code: d.org_id,
          }
        });
        this.moduleLists = moduleLists
      }
    })
  }

  deleteRooms(data) {
    this.loadForm = false;
    if (data.length > 0) {
      this.confirmationService.confirm({
        message: 'Bạn chắc chắn muốn thực hiện hành động này',
        accept: () => {
          const params = {
            ids: data.map(t => t.id)
          };
          this.apiService.delNotifyPushs(params).subscribe(results => {
            if (results.status === 'success') {
              this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.data ? results.data : 'Thành công' });
              this.loadForm = true;
            } else {
              this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: results.message ? results.message : 'Thất bại' });
            }
          })
        }
      })

    } else {
      this.confirmationService.confirm({
        message: 'Bạn chưa chọn căn hộ vui lòng chọn căn hộ',
        rejectVisible: false,
        acceptLabel: 'Oke',
        accept: () => { }
      });
      return;
    }
  }

  saveNotifyInfo(data) {
    this.spinner.show();
    data.forEach(element => {
      element.fields.forEach(element1 => {
        if(element1.field_name === 'content_type') {
          data.forEach(a => {
            a.fields.forEach(b => {
              if (b.field_name === 'content_markdown') {
                if(element1.columnValue == 2) {
                  b.columnValue = this.converter.makeHtml(this.modelMarkdow.content);
                }else {
                  b.columnValue = this.converter.markdown(this.modelMarkdow.content);
                }
              }
            });
          });
      }else  if (element1.field_name === 'content_email') {
        element1.columnValue =  this.converter.makeHtml(this.modelMarkdow.content);
      }
      });
    });
    const params = {
      ...this.dataInfo,
      group_fields: data,
      attachs: this.modelMarkdow.attachs.map(data1 => {
        return {
          attach_name: data1.attach_name,
          attach_url: data1.attach_url
        }
      }),
    }
    this.apiService.setNotifyInfo(params).subscribe(results => {
      if (results.status === 'success') {
        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: results.messages ? results.messages : 'Thành công' });
        this.indexTab = 1;
        this.spinner.hide();
        this.notiId = results.data.id;
        this.router.navigate(['/thong-bao/chi-tiet-gioi-thieu-du-an'], { queryParams: { notiId: results.data.id } });
        // this.getAppNotifyInfo();
      }
    })
  }

}

