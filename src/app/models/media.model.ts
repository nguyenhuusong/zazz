import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
export class Thumb {
    large = '';
    medium = '';
    small = '';
}

export class ImageAndVideo {
    image?= '';
    thumbImage?= '';
    alt?= '';
    title?= '';
    video?= '';
    posterImage?= '';
}

export class Medias {
    created_date = '';
    description = '';
    file_type = '';
    height = 0;
    image = '';
    is_file = false;
    link = '';
    name = '';
    parent_id = '';
    size = '';
    width = '';
    thumbs: Thumb = new Thumb();

}

export class DeleteItem {
    check: false;
    constructor(check: false) {
        this.check = check;
    }
}

export class MediasData {
    created_date = '';
    documentId = ''
    description = '';
    file_type = '';
    height = 0;
    image = '';
    is_file = false;
    link = '';
    name = '';
    parent_id = '';
    size = '';
    width = '';
    thumbs: Thumb = new Thumb();
    id = '';
    path_isfile = '';
    path_isvideo = '';
    path_thumb = '';
    path_url = '';
    edit_path = '';
    check = false;
    checkEdit = false;
    imageAndVideo: ImageAndVideo[] = [];
}

export class ModelMedia {
    created_date: Timestamp = Timestamp.now();
    description = '';
    file_type = '';
    height = 0;
    image = '';
    is_file = false;
    link = '';
    name = '';
    parent_id = '';
    size = '';
    width = 0;
    thumbs: Thumb = new Thumb();
    path_isvideo = '';
    path_isfile = '';
    path_thumb = '';
    path_url = '';
    edit_path = '';
    constructor(created_date = Timestamp.now(), description = '', file_type = '', height = 0, image = '', is_file = false, link = '', name = '', parent_id = '', size = '', width = 0, thumbs = new Thumb(), path_isvideo = '', path_isfile = '', path_thumb = '', path_url = '', edit_path = '') {
        this.created_date = created_date;
        this.description = description;
        this.file_type = file_type;
        this.height = height;
        this.image = image;
        this.is_file = is_file;
        this.link = link;
        this.name = name;
        this.parent_id = parent_id;
        this.size = size;
        this.width = width;
        this.thumbs = thumbs;
        this.path_isvideo = path_isvideo;
        this.path_isfile = path_isfile;
        this.path_thumb = path_thumb;
        this.path_url = path_url;
        this.edit_path = edit_path;
    }
}














