import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-loading-grid',
  templateUrl: './loading-grid.component.html',
  styleUrls: ['./loading-grid.component.css']
})
export class LoadingGridComponent implements OnInit {
  constructor(
    private errorService: ErrorService,
    private spinner: NgxSpinnerService,
  ) {

  }
  @Input() gridtype = 'hsns';
  @Input() columnNumber = 17;
  @Input() value = [1, 2, 3, 4, 5, 6, 7, 84, 4, 3, 4, 5, 6, 7, 45, 67, 7, 45, 67, 67, 67];
  listThs = [];
  isLoad = true;
 async ngOnInit() {
    this.listThs = Array(this.columnNumber).fill(1).map((x, i) => i);
     this.errorService.fetchAll().subscribe(res => {
        if(res === 404 || res === 500 || res === 400 || res === 401 || res === 0) {
          this.isLoad = false;
          this.spinner.hide();
        }
      })
  }
}



