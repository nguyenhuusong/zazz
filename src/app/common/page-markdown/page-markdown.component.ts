import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';
import { ApiService } from 'src/app/services/api.service';
import * as queryString from 'querystring'
@Component({
  selector: 'app-page-markdown',
  templateUrl: './page-markdown.component.html',
  styleUrls: ['./page-markdown.component.css'],
})
export class PageMarkdownComponent implements OnInit {
  // url = environment.uploadServer;
  @Input() modelMarkdow
  @Input() element
  pagingComponent = {
    total: 0
  }
  @Output() uploadOutput = new EventEmitter<any>();
  @ViewChild('fileInput', { static: true }) fileInput;
  humanizeBytes: Function;
  dragOver: boolean;
  items = [];
  pageCount = 1;
  totalRecord = 0;
  imageType
  showDialogimage = false;
  first = 0
  query = {
    notiId: 0,
    offSet: 0,
    pageSize: 15
  }
  constructor(
    private notifyService: ApiService,
    private messageService: MessageService,
    private apiService: ApiService,
  ) { }
  contentTypes = []
  ngOnInit(): void {
    console.log(this.modelMarkdow)
    // this.dataInfo.group_fields.forEach(element => {
    //   element.fields.forEach(element1 => {
    //     if(element1.columnType === 'select' && element1.field_name === 'content_type') {
    //      const queryParams = queryString.stringify({ objKey:element1.columnObject });
    //       this.apiService.getCustObjectList(queryParams).subscribe(results => {
    //         this.contentTypes = results.data.map(d => {
    //           return {
    //             label: d.objName,
    //             value: d.objValue
    //           }
    //         });
    //         this.modelMarkdow.type = element1.columnValue
    //       });
    //     }
    //   });
    // });
  }
  dinhkem
  chooseImageContent() {
    this.dinhkem = 'markdown'
    this.imageType = 2;
    this.showMedia = true;

    // this.loadImage();
    // this.showDialogimage = true;
  }

  paginate(event) {
    this.query.offSet = event.first;
    this.first = event.first;
    this.query.pageSize = event.rows;
    this.loadImage();
  }


  loadImage(event = null) {
    // this.notifyService.getDocumentUrl('',this.query.offSet, this.query.pageSize).then(
    //   (results: any) => {
    //     this.items = results.data;
    //     this.pagingComponent.total = results.recordsTotal;
    //     this.totalRecord = results.recordsTotal;
    //   },
    //   error => { });
  }

  showMedia = false
  handleAttackFile() {
    this.showMedia = true;
    this.dinhkem = 'attack'
  }

  submitMedia(data) {
    if(this.dinhkem === 'attack') {
      if(data && data.length > 0) {
        data.forEach(item => {
          if (item.file_type === 'file') {
            (this.modelMarkdow.attachs as any[]).push({
              id: this.modelMarkdow.id,
              attach_name: item.name,
              attach_url: item.link
            });
          } else {
            (this.modelMarkdow.attachs as any[]).push({
              id: this.modelMarkdow.id,
              attach_name: item.name,
              attach_url: item.image
            });
          }
        });
      }
    }else {
      if(data && data.length > 0) {
        data.forEach(item => {
          if(item.is_file) {
            this.chooseImage(item.thumbs.medium, item)
          }else {
            this.chooseImage(item.link, item)
          }
        })
      }
     
    }
   
    this.showMedia = false;
  }

  chooseImage(documentUrl, item = null) {
    this.modelMarkdow.content = ''
    if (this.imageType === '1') {
      // this.modelMarkdow.imgUrl = documentUrl;
    } else {
      if(item.file_type === 'image') {
        this.element.columnValue += '\r\n![](' + documentUrl + ')'
        this.element.columnValue = this.element.columnValue.replace('null', '')
        this.modelMarkdow.content = this.element.columnValue;
      }else if(item.file_type === 'video'){
        this.element.columnValue += `<video controls
        src="${item.link}"
        poster="${item.thumbs.medium}"
        width="620">
           </video>`
        this.modelMarkdow.content = this.element.columnValue
      }
    }
    this.showDialogimage = false;
  }

  onUploadOutput(event) {
    if (event.target.files[0] && event.target.files[0].size > 0) {
      const getDAte = new Date();
      const getTime = getDAte.getTime();
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(`housing/avatars/${getTime}-${event.target.files[0].name}`).put(event.target.files[0]);
      uploadTask.on('state_changed', (snapshot) => {
      }, (error) => {
      }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              if (downloadURL) {
                  // this.notificationService.showNotification('Upload ảnh thành công', 1);
                  // this.notifyService.setDocumentUrl(downloadURL).then(results => {
                  //   this.loadImage();
                  //   this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Upload thành công' });
                  // }, error => console.log(error));
              }
          });
      });
  }
  }

}
