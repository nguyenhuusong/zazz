import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as firebase from 'firebase';
import { ApiService } from 'src/app/services/api.service';
import * as queryString from 'querystring';
import showdown from 'showdown';
import { MdEditorOption, UploadResult } from 'ngx-markdown-editor';
@Component({
  selector: 'app-page-markdown',
  templateUrl: './page-markdown.component.html',
  styleUrls: ['./page-markdown.component.scss'],
})
export class PageMarkdownComponent implements OnInit {
  @Input() modelMarkdow
  converter = new showdown.Converter();
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
  ) {
    this.preRender = this.preRender.bind(this);
    this.postRender = this.postRender.bind(this);
   }
  contentTypes = [{label: 'HTML',value: 1}, {label: 'Markdown',value: 2}];

  contentArr = ['# Hello, Markdown Editor!'];
  public content: string = '';
  public mode: string = 'editor';
  options: MdEditorOption = {
    showPreviewPanel: true,
    enablePreviewContentClick: false,
    resizable: true,
    customRender: {
      image: function (href: string, title: string, text: string) {
        let out = `<img style="max-width: 100%; border: 2px solid red;" src="${href}" alt="${text}"`;
        if (title) {
          out += ` title="${title}"`;
        }
        console.log(this);
        // out += (<any>this.options).xhtml ? '/>' : '>';
        return out;
      },
    },
  };
  ngOnInit(): void {
    if(this.modelMarkdow.type == 2) {
      this.content = this.converter.markdown(this.element.columnValue);
    }else {
      this.content = this.element.columnValue ? this.element.columnValue : this.contentArr.join('\r\n');
    }

  }

  doUpload(files: Array<File>): Promise<Array<UploadResult>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let result: Array<UploadResult> = [];
        for (let file of files) {
          result.push({
            name: file.name,
            url: `https://avatars3.githubusercontent.com/${file.name}`,
            isImg: file.type.indexOf('image') !== -1,
          });
        }
        resolve(result);
      }, 3000);
    });
  }

  preRender(mdContent: any) {
    console.log(`preRender fired`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(mdContent);
    //   }, 4000);
    // })
    return mdContent;
  }

  onEditorLoaded(editor: any) {
    console.log(`ACE Editor Ins: `, editor);
    // editor.setOption('showLineNumbers', false);

    // setTimeout(() => {
    //   editor.setOption('showLineNumbers', true);
    // }, 2000);
  }

  onPreviewDomChanged(dom: HTMLElement) {
    // console.log(dom);
    // console.log(dom.innerHTML);

    if(this.modelMarkdow.type == 1) {
      this.element.columnValue =dom.innerHTML 
    }else {
      this.element.columnValue = this.content;
    }
  }

  postRender(html: any) {
    console.log(`postRender fired`);
    // return '<h1>Test</h1>';
    return html;
  }



  dinhkem;
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
              id:null,
              attach_name: item.name,
              attach_url: item.link,
              attach_type: item.file_type
            });
          } else {
            (this.modelMarkdow.attachs as any[]).push({
              id:null,
              attach_name: item.name,
              attach_url: item.image,
              attach_type: item.file_type
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
        this.element.columnValue += `\r\n![](${documentUrl})` 
        // this.element.columnValue = this.element.columnValue.replace('null', '')
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
