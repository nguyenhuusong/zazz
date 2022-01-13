import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as firebase from 'firebase';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import { VideoProcessingService } from 'src/app/services/video-processing.service';
import { ModelMedia } from 'src/app/models/media.model';
import { LIBRARY_MEDIA } from '../../constants/constant';
;
@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.component.html',
  styleUrls: ['./add-media.component.scss'],
  providers: [VideoProcessingService]
})
export class AddMediaComponent implements OnInit {

  constructor(
      private formBuilder: FormBuilder,
      private videoService: VideoProcessingService,
      private _sanitizer: DomSanitizer,
      
  ) {
  }

  get f() {
    return this.formMedia.controls;
  }

  get t() {
    return this.f.medias as FormArray;
  }
  public loading = false;
  @Input() dataRouter;
  @Input() selectImage;
  @Input() dataEdit;
  @Input() fileType = 'media';
  @Input() type;
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() submit: EventEmitter<any> = new EventEmitter();
  public formMedia: FormGroup;
  public medias: FormArray;
  public thumbnailData: string;
  images: any[] = [];
  modelMedia: ModelMedia = new ModelMedia();
  isImage360 = false;
  isNomalFile = false;
  ngOnInit() {
    console.log(this.selectImage);
    
    this.createForm();
  }

  createForm() {
    this.formMedia = this.formBuilder.group({
      created_date: [''],
      description: [''],
      image360: [''],
      file_type: [this.type],
      height: [0],
      image: [''],
      is_file: [false],
      link: [''],
      name: ['', this.type === 'folder' ? Validators.required : ''],
      parent_id: [''],
      size: [0],
      width: [0],
      length: [0],
      path_url: [this.dataRouter ? this.dataRouter.edit_path : ''],
      medias: this.formBuilder.array([this.createItem()])
    });
  }

  createItem() {
    return this.formBuilder.group({
      images: [''],
      names: [''],
      sizes: [''],
      file_types: [''], // image
      file_types_full: [''], // image/png
      unitName: [''],
      path: [''],
      path_isFile: [''],
      link: [''],
      path_thumb: [''],
      path_isVideo: [''],
      width: [0],
      height: [0],
    });
  }

  onSave() {
    if (this.formMedia.invalid) {
      return;
    }
    
    if (this.dataRouter) {
      this.f.parent_id.setValue(this.dataRouter.id); // kiem tra co id k
      if (this.formMedia.value.is_file) {
        if (this.isNomalFile) {
          this.save.emit(this.formMedia.value);
          
          // this.activeModal.close();
        } else {
          for (let i = 0; i < this.formMedia.value.medias.length; i++) {
            this.getImageThumbAsPromise(this.formMedia.value.medias[i].path_thumb, i);
          }
        }
      } else {
        this.save.emit(this.formMedia.value);
        // this.activeModal.close();
        
      }
    } else {
      this.save.emit(this.formMedia.value);
      // this.activeModal.close();
      
    }
  }

  addItem(): void {
    this.medias = this.formMedia.get('medias') as FormArray;
    this.medias.push(this.createItem());
  }

  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
  }

  handleGetSizeImage(file, idx) {
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        this.t.controls[idx].get('width').setValue(img.width);
        this.t.controls[idx].get('height').setValue(img.height);
      };
      if (typeof fr.result === 'string') {
        img.src = fr.result;
      }
    };
    fr.readAsDataURL(file);
  }

  formatBytes(bytes, decimals) {
    if (bytes == 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  addFolder(event) {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      this.f.length.setValue(fileList.length);
      this.f.is_file.setValue(true);
      
      for (let i = 0; i < fileList.length; i++) {
        const imageFile = fileList[i];
        this.handleGetSizeImage(fileList[i], i);
        const size = this.formatBytes(fileList[i].size, 2);
        this.t.controls[i].get('sizes').setValue(size);
        this.addItem();
        this.uploadImageAsPromise(imageFile, i, fileList.length);
        this.medias.removeAt(fileList.length);
      }
    }
  }

  getImageThumbAsPromise(path, i) {
    const arrSize = ['256x256', '512x512', '1024x1024'];
    const sliptPath = path.split('.');
    const promises = [];
    for (const item of arrSize) {
      promises.push(this.getUrlImage(`${sliptPath[0]}_${item}.${sliptPath[1]}`).catch(err => {
      }));
    }
    Promise.all(promises).then(results => {
      const data: any = {};
      data.thumbs = {};
      results.forEach(item => {
        if (item.includes('256x256')) {
          data.thumbs.small = item;
        }
        if (item.includes('512x512')) {
          data.thumbs.medium = item;
        }
        if (item.includes('1024x1024')) {
          data.thumbs.large = item;
        }
      });
      this.formMedia.value.medias[i].thumbs = data.thumbs;
      this.images.push(data.thumbs);
    }).then(res => {
      if (i === this.formMedia.value.medias.length - 1) {
        setTimeout(() => {
          this.save.emit(this.formMedia.value);
          
          // this.activeModal.close();
        }, 1000);
      }
    }).catch(err => {
      this.formMedia.value.medias[i].thumbs = null;
      setTimeout(() => {
        this.getImageThumbAsPromise(path, i);
      }, 2000);
    });
  }

  getUrlImage(path) {
    return firebase.storage().ref(path).getDownloadURL();
  }

  uploadImageAsPromise(imageFile, idx, totalfile) {
    const cutString = imageFile.name.split('.');
    const getTime = new Date().getTime();
    let path = '';
    if (this.isNomalFile) {
      path = `${LIBRARY_MEDIA.PATH_S_HOUSING}/` + this.f.path_url.value + '/' + `${getTime}-${imageFile.name}`;
    } else {
      path = `${LIBRARY_MEDIA.PATH_S_HOUSING}/` + this.f.path_url.value + '/' + `${getTime}-${cutString[0]}.${imageFile.type.split('/')[1]}`;
    }
    const pathThumbnails = `${LIBRARY_MEDIA.PATH_S_HOUSING}/` + this.f.path_url.value + '/thumbnails' + '/'
        + `${getTime}-${cutString[0]}.${imageFile.type.split('/')[1]}`;
    const storageRef = firebase.storage().ref(path);
    if (imageFile.type.split('/')[0] === 'video') {
      this.videoService.generateThumbnail(imageFile).then(thumbnailData => {
        this.thumbnailData = thumbnailData;
        const uploadTask = firebase.storage().ref(`${LIBRARY_MEDIA.PATH_S_HOUSING}/${this.f.path_url.value}/${getTime}-${imageFile.name.split('.')[0]}.png`).putString(thumbnailData.split(',')[1], 'base64', {contentType: 'image/png'});
        uploadTask.on('state_changed', (snapshot) => {
        }, (error) => {
          console.log(error);
        }, () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.t.controls[idx].get('path_thumb').setValue(`${LIBRARY_MEDIA.PATH_S_HOUSING}/${this.f.path_url.value}/thumbnails/${getTime}-${imageFile.name.split('.')[0]}.png`);
            this.t.controls[idx].get('path_isFile').setValue(`${LIBRARY_MEDIA.PATH_S_HOUSING}/${this.f.path_url.value}/${getTime}-${imageFile.name.split('.')[0]}.png`);
            this.t.controls[idx].get('images').setValue(downloadURL);
            this.t.controls[idx].get('names').setValue(cutString[0]);
            this.t.controls[idx].get('file_types').setValue(imageFile.type.split('/')[0]);
            this.t.controls[idx].get('unitName').setValue(cutString[0]);
            this.t.controls[idx].get('file_types_full').setValue('image/png');
          });
        });
      });
    }
    return new Promise((resolve, reject) => {
      const task = storageRef.put(imageFile, {customMetadata: {cacheControl: 'public,max-age=3000'}});
      task.on('state_changed', (snapshot) => {
      }, (error) => {
      }, () => {
        task.snapshot.ref.getDownloadURL().then((downloadURL) => {
          if (downloadURL) {
            if (imageFile.type.split('/')[0] === 'image') {
              this.f.link.setValue('');
              this.t.controls[idx].get('path_isFile').setValue(path);
              this.t.controls[idx].get('path_thumb').setValue(pathThumbnails);
              this.t.controls[idx].get('images').setValue(downloadURL);
              this.t.controls[idx].get('names').setValue(cutString[0]);
              this.t.controls[idx].get('file_types').setValue(imageFile.type.split('/')[0]);
              this.t.controls[idx].get('unitName').setValue(cutString[0]);
              this.t.controls[idx].get('file_types_full').setValue(imageFile.type);
            } else if (imageFile.type.split('/')[0] === 'video') {
              this.t.controls[idx].get('path_isVideo').setValue(path);
              this.f.link.setValue(downloadURL);
            } else {
              this.f.link.setValue(downloadURL);
              this.t.controls[idx].get('path_isFile').setValue(path);
              this.t.controls[idx].get('link').setValue(downloadURL);
              this.t.controls[idx].get('path_thumb').setValue(pathThumbnails);
              this.t.controls[idx].get('images').setValue('');
              this.t.controls[idx].get('names').setValue(cutString[0]);
              this.t.controls[idx].get('file_types').setValue(imageFile.type.split('/')[0]);
              this.t.controls[idx].get('unitName').setValue(cutString[0]);
              this.t.controls[idx].get('file_types_full').setValue(imageFile.type);
            }
            
          }
        });
      });
    });
  }

  thisFileUpload(type = false) {
    this.isNomalFile = type;
    document.getElementById('uploadAll').click();
  }

  deleteAvatar() {
  }

  closeModal(event) {
    // this.activeModal.close();
  }

  showImage360() {
    this.isNomalFile = false;
    this.isImage360 = !this.isImage360
    if (!this.isImage360) {
      this.formMedia.controls.image360.setValue('');
    }
  }
}
