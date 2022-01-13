import { CONSTANTS } from './../../constants';
import { NotificationService } from './../../../services/notification.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as XLSX from 'xlsx';
type AOA = any[][];
declare var jQuery: any;
@Component({
  selector: 'app-sheet',
  templateUrl: 'excel.component.html',
  styleUrls: ['./excel.component.css']
})

export class ExcelComponent implements OnInit {
  excelData: AOA[] = [];
  data: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName = 'SheetJS.xlsx';
  loading = false;
  uploadFile;
  @Output() readData = new EventEmitter<any>();
  @Output() load = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  cancel() {
    this.excelData = [];
    this.uploadFile = null;
    this.showUpload = true
  }
  showUpload = true
  listHeader = []
  onFileChange(evt: any) {
    this.excelData = [];
    this.uploadFile = null;
    setTimeout(() => {
      if (evt.target.files.length > 0) {
        this.loading = true;
        /* wire up file reader */
        this.showUpload = false
        this.uploadFile = evt.target.files;
        const target: DataTransfer = (evt.target) as DataTransfer;
        if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          const arrayAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').map(d => `${d}1`);
          const sheetNames = wb.SheetNames;
          // const key = wb.Sheets[sheetNames[0]]["!autofilter"].ref.split(':');
          // const indexfirst = arrayAlphabet.findIndex(d => d === key[0]);
          // const indexlast = arrayAlphabet.findIndex(d => d === key[1]);
          // const arrayHeader = arrayAlphabet.slice(indexfirst, indexlast + 1);
          // const listHeader = [];
          // for(let item of arrayHeader) {
          //   listHeader.push(wb.Sheets.Sheet1[item].r);
          //   // delete wb.Sheets.Sheet1[item]
          // }
          // this.listHeader = listHeader;
          // for (let i = 0; i < wb.SheetNames.length; i++) {
          //   // Read all data in onesheet
         
          // }
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          /* save data */
          this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 })) as AOA;
          // Save data to list sheet
          this.excelData.push(this.data);
          this.readData.emit(this.excelData);
          this.loading = false;
        };
        reader.readAsBinaryString(target.files[0]);
      }
    }, 500);
  }


  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  toggleDisplay() {
    jQuery('#excelcontent').slideToggle();
  }

  handleImport() {
    if (this.uploadFile) {
      const fileToUpload = <File>this.uploadFile[0];
      const formData = new FormData();
      formData.append('formFile', fileToUpload, fileToUpload.name);
      this.load.emit(formData);
    } else {
      alert(CONSTANTS.MESSAGE.CHOOSE_FILE);
    }
  }
}
