import { FeedBaseService } from 'src/app/services/firebase.service';
import { TreeNode, MenuItem } from 'primeng/api';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import * as firebase from 'firebase';
import { ModelMedia } from 'src/app/models/media.model';
import { grabProperty, initItemMedia } from '../../function-common/objects.helper';
;

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss']
})
export class MediaListComponent implements OnInit {
  libraries: any = [];
  dataTrees: TreeNode[] = [];
  selectedFile: TreeNode;
  roots: any = [];
  contextMenus: MenuItem[];
  loading = false;
  dataRouter;
  contents: any = []; // Store data get in a node
  contentsDisplay: any = []; // Store data to display when search, filter
  mediaSelected: string[] = []; // Store selected items
  filter = {
    search: '',
    type: 'all',
    sort: false
  };
  selectImage = false;
  modelMedia: ModelMedia = new ModelMedia();
  @Output() save = new EventEmitter<any>();
  constructor(
              private firebaseService: FeedBaseService,
              ) { }

  ngOnInit(): void {
    this.initData();

    this.contextMenus = [
      { label: 'Thêm thư mục', icon: 'pi pi-folder-open', command: (event) => this.addFolder(this.selectedFile) },
      { label: 'Thêm tệp', icon: 'pi pi-file-o', command: (event) => this.addFile(this.selectedFile) }
    ];
  }

  addFolder(file: TreeNode) {
    this.handleAddMedia(file.data.id, 'folder', 'top');
  }
 
  addFile(file: TreeNode) {
    this.handleAddMedia(file.data.id, 'file', 'top');
  }
  
  handleAddRootFolder() {
    this.handleAddMedia('', 'folder', 'left');
  }

  async getLibraries() {
    const libraries = [];
    
    try {
      // Get all folder to build the trees
      await this.firebaseService.getAllDocumentWithCondition('library_media', 'is_file', false, '==').then(res => {
        res.forEach(doc => {
          const data = initItemMedia(doc.data()).value;
          data.documentId = doc.id;
          data.id = doc.id;
          libraries.push(data);
        });
      });
      
      return libraries;
    } catch (error) {
      console.log('Error get library:', error);
      
      return [];
    }
  }

  async initData() {
    this.libraries = await this.getLibraries();
    this.dataTrees = this.convertJsonToStructTree(this.libraries);
  }


  convertJsonToStructTree(list) {
    list = JSON.parse(JSON.stringify(list));
    const map = {};
    let node;
    let i;
    const roots = [];
    for (i = 0; i < list.length; i += 1) {
      map[list[i].documentId] = i; // initialize the map
      list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parent_id !== '') {
        // if you have dangling branches check that map[node.parentId] exists
        if (list[map[node.parent_id]]) {
          list[map[node.parent_id]].children.push({
            nodeId: node.documentId,
            data: { id: node.documentId, value: node },
            expandedIcon: node.is_file ? '' : 'pi pi-folder-open',
            collapsedIcon: node.is_file ? '' : 'pi pi-folder',
            icon: node.is_file ? 'pi pi-file' : '',
            label: node.name,
            children: node.children
          });
        }
      } else {
        roots.push({
          nodeId: node.documentId,
          data: { id: node.documentId, value: node },
          expandedIcon: node.is_file ? '' : 'pi pi-folder-open',
          collapsedIcon: node.is_file ? '' : 'pi pi-folder',
          icon: node.is_file ? 'pi pi-file' : '',
          label: node.name,
          children: node.children
        });
      }
    }
    return roots;
  }

  closeModal() {
   this.save.emit();
  }

  nodeSelect(event) {
    this.mediaSelected = [];
    this.getDataInSelectedNode(event.node.nodeId);
    this.dataRouter = event.node.nodeId;
    console.log('nodeid:', event.node.nodeId);
  }

  async getDataInSelectedNode(id) {
    
    const refreshRequest = await this.firebaseService
      .getAllDocumentWithCondition('library_media',
        'parent_id', id, '==');
    this.contents = [];
    this.contentsDisplay = [];
    refreshRequest.forEach(doc => {
      const data = initItemMedia(doc.data()).value;
      data.documentId = doc.id;
      data.id = doc.id;
      this.contents.push(data);
    });
    this.contents = this.contents.filter(item => item.is_file === true).map(item => {
      return {
        ...item,
        nameDisplay: item.name.length > 10 ? item.name.slice(0, 10) + '...' : item.name
      };
    });
    this.contentsDisplay = JSON.parse(JSON.stringify(this.contents));
    
  }

  nodeUnselect(event) {
  }

  handleSave() {
    const data = [];
    console.log(this.contents)
    this.contents.forEach(item => {
      if (this.mediaSelected.includes(item.documentId)) {
        data.push(item);
      }
    });
    this.save.emit(data);
    this.closeModal();
  }

  updateSelected(event) {
    if (event.target.checked) {
      this.mediaSelected.push(event.target.value);
    } else {
      this.mediaSelected = this.mediaSelected.filter(t => t !== event.target.value);
    }
  }

  handleSearch() {
    if (this.filter.type !== 'all') {
      this.contentsDisplay = this.contents.filter(item => item.file_type.toLowerCase() === this.filter.type.toLowerCase());
    }
    if (this.filter.search !== '') {
      this.contentsDisplay = this.contents.filter(item => item.name.toLowerCase().includes(this.filter.search));
    }
  }






  //#region Xử lí thêm file, folder
  modelAdd = {
    type: '',
    id: '',
    dataRouter: ''
  }
  handleAddMedia(id, type, vitri) {
    this.selectImage = true;
    if (vitri === 'left') {
      this.dataRouter = null;
    }
    this.modelAdd.type = type;
    this.modelAdd.dataRouter = vitri === 'top' ? this.dataRouter : '';
    this.modelAdd.id = id;
    // const modalRef = this.ngbModalService.open(AddMediaComponent, { size: 'sm', windowClass: 'modal-holder' });
    // modalRef.componentInstance.dataRouter = vitri === 'top' ? this.dataRouter : '';
    // modalRef.componentInstance.type = type;
    // modalRef.componentInstance.save.subscribe(async (receiveEntry) => {
     
    // });
  }
  displayAddImage = false
 async saveMedia(receiveEntry) {
    if (receiveEntry) {
      console.log(receiveEntry)
      debugger
      this.modelMedia.created_date = firebase.firestore.Timestamp.fromDate(new Date());
      if (this.dataRouter) {
        if (receiveEntry.is_file) {
          this.setParams(this.modelAdd.id, receiveEntry);
          this.selectImage = false;
        } else {
          this.modelMedia = new ModelMedia();
          this.modelMedia.name = receiveEntry.name;
          this.modelMedia.is_file = false;
          this.modelMedia.parent_id = this.modelAdd.id;
          this.modelMedia.thumbs = { ...receiveEntry.thumbs };
          this.modelMedia.path_isvideo = '';
          this.modelMedia.path_isfile = '';
          this.modelMedia.path_thumb = '';
          this.modelMedia.path_url = `${receiveEntry.path_url}/${receiveEntry.name}`;
          this.modelMedia.edit_path = `${receiveEntry.path_url}/${receiveEntry.name}`;
          await this.createDocumentMedia(this.modelAdd.id, this.modelMedia);
          this.selectImage = false;
        }
      } else {
        // Thêm thư mục folder cha
        this.modelMedia = new ModelMedia();
        this.modelMedia.name = receiveEntry.name;
        this.modelMedia.is_file = false;
        this.modelMedia.thumbs = { ...receiveEntry.thumbs };
        this.modelMedia.path_url = receiveEntry.name;
        this.modelMedia.edit_path = receiveEntry.name;
        await this.createDocumentMedia(this.modelAdd.id, this.modelMedia);
        this.selectImage = false;
      }
    } else {
      this.selectImage = false;
    }
    receiveEntry.medias = receiveEntry.medias.map(item => {
      item.select = false;
      return item;
    });
  }

  setParams(id, states) {
    if (states.medias && states.medias.length > 0) {
      states.medias.forEach(media => {
        this.modelMedia = new ModelMedia();
        this.modelMedia.file_type = grabProperty(media, 'file_types', '');
        this.modelMedia.name = grabProperty(media, 'names', '');
        this.modelMedia.size = grabProperty(media, 'sizes', '');
        this.modelMedia.image = grabProperty(media, 'images', '');
        this.modelMedia.path_isvideo = grabProperty(media, 'path_isVideo', '');
        this.modelMedia.path_isfile = grabProperty(media, 'path_isFile', '');
        this.modelMedia.path_thumb = grabProperty(media, 'path_thumb', '');
        this.modelMedia.link = grabProperty(media, 'link', '');
        this.modelMedia.is_file = true;
        this.modelMedia.thumbs = { ...media.thumbs };
        this.modelMedia.parent_id = id;
        this.modelMedia.path_url = grabProperty(states, 'path_url', '');
        this.modelMedia.edit_path = grabProperty(states, 'path_url', '');
        this.modelMedia.width = grabProperty(states, 'width', '');
        this.modelMedia.height = grabProperty(states, 'height', '');
        this.createDocumentMediasMulti({ ...this.modelMedia });
      });
    }
  }

  createDocumentMediasMulti(modelMedia) {
    if (modelMedia.file_type !== 'image' && modelMedia.file_type !== 'video' && modelMedia.file_type !== '360') {
      modelMedia.file_type = 'file';
    }
    this.firebaseService.createDocumentAutoGenerateName('library_media', modelMedia).then(results => {
      modelMedia.documentId = results.id;
      // this.notificationService.showNotification(CONSTANTS.MESSAGE_ALERT.CREATE_FILE_SUCCESSFUL, CONSTANTS.MESSAGE_TYPE.SUCCESSFUL);
      this.contentsDisplay.push(modelMedia);
      this.contents.push(modelMedia);
    }).catch(err => {
      console.log('Lỗi rồi:', err);
    });
  }

  async createDocumentMedia(id, receiveEntry) {
    await this.firebaseService.createDocumentAutoGenerateName('library_media', { ...receiveEntry }).then((res) => {
      receiveEntry.documentId = res.id;
      receiveEntry.id = res.id;
      if (!receiveEntry.path_url) {
        this.getDataInSelectedNode(id);
      } else {
        this.initData();
      }
      // this.notificationService.showNotification(CONSTANTS.MESSAGE_ALERT.CREATE_FOLDER_SUCCESSFUL, CONSTANTS.MESSAGE_TYPE.SUCCESSFUL);
    });
  }
  //#endregion
}
