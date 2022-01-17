import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as firebase from 'firebase';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { EChooseType, IdentityCard } from 'src/app/models/identity-card.model';
import { ApiHrmService } from 'src/app/services/api-hrm/apihrm.service';
@Component({
  selector: 'app-detect-card',
  templateUrl: './detect-card.component.html',
  styleUrls: ['./detect-card.component.css']
})
export class DetectCardComponent implements OnInit, OnChanges {
  frontImage: File = null;
  backImage: File = null;
  imgDefault = '../../assets/images/crop-pic.jpg';
  imageMt = null;
  imageMs = null;
  imageHC = null;
  previewHc = null
  custIndi = {
    email: '',
    phone: '',
    typeCard: 1
  }

  typeCards = [
    { label: 'CMND', value: 1 },
    { label: 'CCCD', value: 2 },
    { label: 'Hộ chiếu', value: 3 },
  ]
  // doc_sub_type = 'identity1' , 'identity2' ,'identity3' , 'identity4', 'identity5'
  // doc_sub_type = 'CMND mặt trước' , 'CMND mặt sau' ,'CCCD mặt trước' , 'CCCD mặt sau', 'HC'

  constructor(
    private apiService: ApiHrmService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
  ) { }
  @Input() thongtinchitietthe
  @Input() isShowRegister
  @Output() callback = new EventEmitter<any>();
  @Output() reset= new EventEmitter<any>();
  ngOnInit(): void {
  }

  ngOnChanges(event) {
    if (event && this.thongtinchitietthe && this.thongtinchitietthe.metas.length > 0) {
      for (let item of this.thongtinchitietthe.metas) {
            if(item.doc_type === 'identity1' || item.doc_type === 'identity3') {
                if(item.doc_sub_type === 'identity1' || item.doc_sub_type === 'identity3') {
                  this.imageMt = item.metaUrl
                }else {
                  this.imageMs = item.metaUrl
                }
            }else {
              this.imageHC = item.metaUrl
            }
      }
    }
  }

  uploadMtCm(event) {
    this.frontImage = null;
    this.imageMt = null;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.frontImage = event.target.files[0];
      if (this.custIndi.typeCard === 1) {
        this.frontImage['doc_sub_type'] = 'identity1';
      } else {
        this.frontImage['doc_sub_type'] = 'identity3';
      }

      const reader = new FileReader();
      reader.onload = e => this.imageMt = reader.result;
      reader.readAsDataURL(file);
    }
  }

  uploadHC(event) {
    this.imageHC = null;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.imageHC = event.target.files[0];
      this.imageHC['doc_sub_type'] = 'identity5';
      const reader = new FileReader();
      reader.onload = e => this.previewHc = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onChangeTypeCards() {
    if (this.custIndi.typeCard === 1) {
      this.frontImage['doc_sub_type'] = 'identity1';
      this.backImage['doc_sub_type'] = 'identity2';
    }else if(this.custIndi.typeCard === 3) {
      this.imageHC['doc_sub_type'] = 'identity5';
    } else {
      this.frontImage['doc_sub_type'] = 'identity3';
      this.backImage['doc_sub_type'] = 'identity4';
    }

  }

  uploadMsCm(event) {
    this.backImage = null;
    this.imageMs = null;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.backImage = event.target.files[0];
      if (this.custIndi.typeCard === 1) {
        this.backImage['doc_sub_type'] = 'identity2';
      } else {
        this.backImage['doc_sub_type'] = 'identity4';
      }
      const reader = new FileReader();
      reader.onload = e => this.imageMs = reader.result;
      reader.readAsDataURL(file);
    }
  }
  type: EChooseType = EChooseType.TWO_FACE;
  async handleGetIdentityCard() {
    if (this.custIndi.typeCard === 1 || this.custIndi.typeCard === 2) {
      // CMND/CCCD
      let resultData;
      const images = [];
      const result = await Promise.all([this.apiService.getIdentityCardInfomation(this.frontImage).toPromise(),
      this.apiService.getIdentityCardInfomation(this.backImage).toPromise()]);
      resultData = this.mappingDataUploadTwoFace(result[1] as IdentityCard, result[0] as IdentityCard);

      images.push(
        await this.handlUploadFile(
          `housing/cards/one-face/${this.getTime()}/${this.frontImage.name}`, this.frontImage, 'Mặt trước'));

          images.push(
        await this.handlUploadFile(`housing/cards/one-face/${this.getTime()}/${this.backImage.name}`, this.backImage, 'Mặt sau'));

        return {
          datadetect: resultData,
          images: images
        };
    } else {
      // HỘ chiếu
      let resultData;
      const images = [];
      const result = await Promise.all([this.apiService.getIdentityCardInfomation(this.imageHC).toPromise()]);
      resultData = this.mappingDataUploadTwoFace(null, result[0] as IdentityCard);

      images.push(
        await this.handlUploadFile(
          `housing/cards/ho-chieu/${this.getTime()}/${this.imageHC.name}`, this.imageHC, 'Hộ chiếu'));
      // resultData.images.push(
      //   await this.handlUploadFile(`housing/cards/one-face/${this.getTime()}/${this.backImage.name}`, this.backImage, 'Mặt sau'));
      return {
        datadetect: resultData,
        images: images
      };
    }


  }

  getTime() {
    const date = new Date();
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
  }

  async handlUploadFile(path, data, directionType) {
    const storageRef = firebase.storage().ref();
    const uploadTask = await storageRef.child(path).put(data);
    const url = await uploadTask.ref.getDownloadURL();
    return { url, name: data.name, directionType, type: data.type.split('/')[0], doc_sub_type: data.doc_sub_type };
  }

  resetCard() {
    this.reset.emit();
  }

  mappingDataUploadTwoFace(backData: IdentityCard, frontData: IdentityCard) {
    const result = new IdentityCard();
    result.address = frontData.address === 'N/A' ? null : frontData.address;
    result.addressconf = frontData.addressconf === 'N/A' ? null : frontData.addressconf;
    result.birthday = frontData.birthday === 'N/A' ? null : frontData.birthday;
    result.birthdayconf = frontData.birthday === 'N/A' ? null : frontData.birthday;
    result.characteristics = backData && backData.characteristics !== 'N/A' ? backData.characteristics : null;
    result.characteristics_conf = backData && backData.characteristics_conf !== 'N/A' ? backData.characteristics_conf : null;
    result.class = frontData.class === 'N/A' ? null : frontData.class;
    result.copyright = frontData.copyright === 'N/A' ? null : frontData.copyright;
    result.country = frontData.country === 'N/A' ? null : frontData.country;
    result.district = frontData.district === 'N/A' ? null : frontData.district;
    result.document = frontData.document === 'N/A' ? null : frontData.document;
    result.ethnicity = frontData.ethnicity === 'N/A' ? null : frontData.ethnicity;
    result.expiry = frontData.expiry === 'N/A' ? null : frontData.expiry;
    result.hometown = frontData.hometown === 'N/A' ? null : frontData.hometown;
    result.hometownconf = frontData.hometownconf === 'N/A' ? null : frontData.hometownconf;
    result.id = frontData.id === 'N/A' ? null : frontData.id;
    result.id_check = frontData.id_check === 'N/A' ? null : frontData.id_check;
    result.id_logic = frontData.id_logic === 'N/A' ? null : frontData.id_logic;
    result.id_logic_message = frontData.id_logic_message === 'N/A' ? null : frontData.id_logic_message;
    result.id_type = frontData.id_type === 'N/A' ? null : frontData.id_type;
    result.idconf = frontData.idconf === 'N/A' ? null : frontData.idconf;
    result.issue_by = backData && backData.issue_by !== 'N/A' ? backData.issue_by : null;
    result.issue_by_conf = backData && backData.issue_by_conf !== 'N/A' ? backData.issue_by_conf : null;
    result.issue_date = backData && backData.issue_date !== 'N/A' ? backData.issue_date : null;
    result.issue_date_conf = backData && backData.issue_date_conf !== 'N/A' ? backData.issue_date_conf : null;
    result.name = frontData.name === 'N/A' ? null : frontData.name;
    result.nameconf = frontData.nameconf === 'N/A' ? null : frontData.nameconf;
    result.national = frontData.national === 'N/A' ? null : frontData.national;
    result.precinct = frontData.precinct === 'N/A' ? null : frontData.precinct;
    result.province = frontData.province === 'N/A' ? null : frontData.province;
    result.religion = frontData.religion === 'N/A' ? null : frontData.religion;
    result.result_code = frontData.result_code === 'N/A' ? null : frontData.result_code;
    result.server_name = frontData.server_name === 'N/A' ? null : frontData.server_name;
    result.server_ver = frontData.server_ver === 'N/A' ? null : frontData.server_ver;
    result.sex = frontData.sex === 'N/A' ? null : frontData.sex;
    result.street = frontData.street === 'N/A' ? null : frontData.street;
    result.street_name = frontData.street_name === 'N/A' ? null : frontData.street_name;
    return result;
  }

  async sendCustIndiCreate() {
    let resultData;
    if (this.backImage === null || this.frontImage === null) {
      this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng chọn đủ hai mặt' });
      return;
    }
    this.spinner.show();
    resultData = await this.handleGetIdentityCard();
    console.log(resultData)
    this.spinner.hide();
    this.callback.emit({
      card_info: resultData.datadetect,
      images: resultData.images,
      info: this.custIndi
    });
    this.isShowRegister = true;
  }

}
