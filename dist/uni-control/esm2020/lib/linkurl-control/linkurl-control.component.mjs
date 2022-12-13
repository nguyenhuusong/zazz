import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "primeng/fileupload";
import * as i2 from "@angular/common";
import * as i3 from "primeng/api";
export class LinkurlControlComponent {
    constructor() {
        this.isUploadMultiple = true;
        this.submit = false;
        this.isUpload = false;
        this.callbackDatetimes = new EventEmitter();
        this.classInput = false;
    }
    ngOnInit() {
    }
    onChangeValue(event, field_name, element) {
        this.isUpload = true;
        this.modelFields[field_name].error = this.modelFields[field_name].isRequire && !this.element.columnValue ? true : false;
        this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : '';
        if (event.currentFiles.length > 0) {
            this.callbackDatetimes.emit({
                event: element,
                value: event,
                field: field_name
            });
            setTimeout(() => {
                this.isUpload = false;
            }, 500);
        }
    }
    inputFocus(event) {
        if (!this.element.columnValue) {
            this.classInput = true;
        }
    }
    inputFocusOut(event) {
        if (this.element.columnValue) {
            this.classInput = true;
        }
        else {
            this.classInput = false;
        }
    }
}
LinkurlControlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LinkurlControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
LinkurlControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: LinkurlControlComponent, selector: "lib-linkurl-control", inputs: { element: "element", isUploadMultiple: "isUploadMultiple", modelFields: "modelFields", dataView: "dataView", detail: "detail", submit: "submit" }, outputs: { callbackDatetimes: "callbackDatetimes" }, ngImport: i0, template: "<div class=\"linkurl-drag\">\n    <div class=\"wrap-upload\">\n              <p-fileUpload accept=\"image/jpeg,image/png,image/jpg,image/gif,.mp4,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,application/msword,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document\" *ngIf=\"!isUpload\" [chooseLabel]=\"''\" [chooseIcon]=\"''\"  \n              [multiple]=\"isUploadMultiple ? true : null\" [showUploadButton]=\"false\" [showCancelButton]=\"false\" [customUpload]=\"true\" name=\"demo[]\" \n               (onSelect)=\"onChangeValue($event, element.field_name, element)\" [maxFileSize]=\"10000000\">\n                  <ng-template pTemplate=\"toolbar\">\n                  </ng-template>\n                  <ng-template pTemplate=\"content\">\n                    <div class=\"content-upload text-center\">\n                          <h3 style=\"color: #182850;\">Ta\u0309i t\u00EA\u0323p & Ke\u0301o t\u00EA\u0323p</h3>\n                          <p>Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT</p>\n                    </div>\n                  </ng-template>\n              </p-fileUpload>\n            </div>\n            <div class=\"file-uploaded\" *ngIf=\"element.columnValue && element.columnValue.length > 0\">\n              <h3 class=\"uploaded-title\">\u0110\u00E3 upload xong {{ element.columnValue.length }} file</h3>\n              <!-- <ul *ngIf=\"uploadedFiles.length > 0\">\n                  <li class=\"d-flex middle bet\" *ngFor=\"let file of uploadedFiles; let i=index\">{{file}} \n                    <span (click)=\"removeImage(i)\">\n                        <svg width=\"12\" height=\"14\" viewBox=\"0 0 12 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                          <path d=\"M9.33366 5.33341V12.0001H2.66699V5.33341H9.33366ZM8.33366 0.666748H3.66699L3.00033 1.33341H0.666992V2.66675H11.3337V1.33341H9.00033L8.33366 0.666748ZM10.667 4.00008H1.33366V12.0001C1.33366 12.7334 1.93366 13.3334 2.66699 13.3334H9.33366C10.067 13.3334 10.667 12.7334 10.667 12.0001V4.00008Z\" fill=\"#FF3B49\"/>\n                          <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4.00033 10.3334V6.66675H5.33366V10.3334H4.00033Z\" fill=\"#FF3B49\"/>\n                          <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M6.66699 10.3334V6.66675H8.00033V10.3334H6.66699Z\" fill=\"#FF3B49\"/>\n                        </svg>\n                    </span>\n                  </li>\n              </ul> -->\n            </div>\n            <!-- <div class=\"file-uploaded\" *ngIf=\"element.columnValue && (element.columnValue.length > 0) && (uploadedFiles.length === 0)\">\n            <ul>\n                <li class=\"d-flex middle bet\" *ngFor=\"let file of element.columnValue; let i=index\">{{file}} \n                  <span (click)=\"removeImage1(i)\">\n                      <svg width=\"12\" height=\"14\" viewBox=\"0 0 12 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                        <path d=\"M9.33366 5.33341V12.0001H2.66699V5.33341H9.33366ZM8.33366 0.666748H3.66699L3.00033 1.33341H0.666992V2.66675H11.3337V1.33341H9.00033L8.33366 0.666748ZM10.667 4.00008H1.33366V12.0001C1.33366 12.7334 1.93366 13.3334 2.66699 13.3334H9.33366C10.067 13.3334 10.667 12.7334 10.667 12.0001V4.00008Z\" fill=\"#FF3B49\"/>\n                        <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4.00033 10.3334V6.66675H5.33366V10.3334H4.00033Z\" fill=\"#FF3B49\"/>\n                        <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M6.66699 10.3334V6.66675H8.00033V10.3334H6.66699Z\" fill=\"#FF3B49\"/>\n                      </svg>\n                  </span>\n                </li>\n            </ul>\n            </div> -->\n        </div>", styles: [""], components: [{ type: i1.FileUpload, selector: "p-fileUpload", inputs: ["name", "url", "method", "multiple", "accept", "disabled", "auto", "withCredentials", "maxFileSize", "invalidFileSizeMessageSummary", "invalidFileSizeMessageDetail", "invalidFileTypeMessageSummary", "invalidFileTypeMessageDetail", "invalidFileLimitMessageDetail", "invalidFileLimitMessageSummary", "style", "styleClass", "previewWidth", "chooseLabel", "uploadLabel", "cancelLabel", "chooseIcon", "uploadIcon", "cancelIcon", "showUploadButton", "showCancelButton", "mode", "headers", "customUpload", "fileLimit", "files"], outputs: ["onBeforeUpload", "onSend", "onUpload", "onError", "onClear", "onRemove", "onSelect", "onProgress", "uploadHandler"] }], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i3.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: LinkurlControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-linkurl-control', template: "<div class=\"linkurl-drag\">\n    <div class=\"wrap-upload\">\n              <p-fileUpload accept=\"image/jpeg,image/png,image/jpg,image/gif,.mp4,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,application/msword,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.wordprocessingml.document\" *ngIf=\"!isUpload\" [chooseLabel]=\"''\" [chooseIcon]=\"''\"  \n              [multiple]=\"isUploadMultiple ? true : null\" [showUploadButton]=\"false\" [showCancelButton]=\"false\" [customUpload]=\"true\" name=\"demo[]\" \n               (onSelect)=\"onChangeValue($event, element.field_name, element)\" [maxFileSize]=\"10000000\">\n                  <ng-template pTemplate=\"toolbar\">\n                  </ng-template>\n                  <ng-template pTemplate=\"content\">\n                    <div class=\"content-upload text-center\">\n                          <h3 style=\"color: #182850;\">Ta\u0309i t\u00EA\u0323p & Ke\u0301o t\u00EA\u0323p</h3>\n                          <p>Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT</p>\n                    </div>\n                  </ng-template>\n              </p-fileUpload>\n            </div>\n            <div class=\"file-uploaded\" *ngIf=\"element.columnValue && element.columnValue.length > 0\">\n              <h3 class=\"uploaded-title\">\u0110\u00E3 upload xong {{ element.columnValue.length }} file</h3>\n              <!-- <ul *ngIf=\"uploadedFiles.length > 0\">\n                  <li class=\"d-flex middle bet\" *ngFor=\"let file of uploadedFiles; let i=index\">{{file}} \n                    <span (click)=\"removeImage(i)\">\n                        <svg width=\"12\" height=\"14\" viewBox=\"0 0 12 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                          <path d=\"M9.33366 5.33341V12.0001H2.66699V5.33341H9.33366ZM8.33366 0.666748H3.66699L3.00033 1.33341H0.666992V2.66675H11.3337V1.33341H9.00033L8.33366 0.666748ZM10.667 4.00008H1.33366V12.0001C1.33366 12.7334 1.93366 13.3334 2.66699 13.3334H9.33366C10.067 13.3334 10.667 12.7334 10.667 12.0001V4.00008Z\" fill=\"#FF3B49\"/>\n                          <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4.00033 10.3334V6.66675H5.33366V10.3334H4.00033Z\" fill=\"#FF3B49\"/>\n                          <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M6.66699 10.3334V6.66675H8.00033V10.3334H6.66699Z\" fill=\"#FF3B49\"/>\n                        </svg>\n                    </span>\n                  </li>\n              </ul> -->\n            </div>\n            <!-- <div class=\"file-uploaded\" *ngIf=\"element.columnValue && (element.columnValue.length > 0) && (uploadedFiles.length === 0)\">\n            <ul>\n                <li class=\"d-flex middle bet\" *ngFor=\"let file of element.columnValue; let i=index\">{{file}} \n                  <span (click)=\"removeImage1(i)\">\n                      <svg width=\"12\" height=\"14\" viewBox=\"0 0 12 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                        <path d=\"M9.33366 5.33341V12.0001H2.66699V5.33341H9.33366ZM8.33366 0.666748H3.66699L3.00033 1.33341H0.666992V2.66675H11.3337V1.33341H9.00033L8.33366 0.666748ZM10.667 4.00008H1.33366V12.0001C1.33366 12.7334 1.93366 13.3334 2.66699 13.3334H9.33366C10.067 13.3334 10.667 12.7334 10.667 12.0001V4.00008Z\" fill=\"#FF3B49\"/>\n                        <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4.00033 10.3334V6.66675H5.33366V10.3334H4.00033Z\" fill=\"#FF3B49\"/>\n                        <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M6.66699 10.3334V6.66675H8.00033V10.3334H6.66699Z\" fill=\"#FF3B49\"/>\n                      </svg>\n                  </span>\n                </li>\n            </ul>\n            </div> -->\n        </div>", styles: [""] }]
        }], ctorParameters: function () { return []; }, propDecorators: { element: [{
                type: Input
            }], isUploadMultiple: [{
                type: Input
            }], modelFields: [{
                type: Input
            }], dataView: [{
                type: Input
            }], detail: [{
                type: Input
            }], submit: [{
                type: Input
            }], callbackDatetimes: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlua3VybC1jb250cm9sLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3VuaS1jb250cm9sL3NyYy9saWIvbGlua3VybC1jb250cm9sL2xpbmt1cmwtY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL2xpbmt1cmwtY29udHJvbC9saW5rdXJsLWNvbnRyb2wuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFNL0UsTUFBTSxPQUFPLHVCQUF1QjtJQVNsQztRQVBTLHFCQUFnQixHQUFHLElBQUksQ0FBQztRQUl4QixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDUCxzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRXRELGVBQVUsR0FBRyxLQUFLLENBQUM7SUFESCxDQUFDO0lBRWpCLFFBQVE7SUFDUixDQUFDO0lBRUQsYUFBYSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTztRQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN4SCxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMxRyxJQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQztZQUMvQixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDO2dCQUMxQixLQUFLLEVBQUUsT0FBTztnQkFDZCxLQUFLLEVBQUUsS0FBSztnQkFDWixLQUFLLEVBQUUsVUFBVTthQUNsQixDQUFDLENBQUE7WUFFRixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNUO0lBRUgsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFLO1FBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO1lBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFLO1FBQ2pCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7YUFBTTtZQUNMLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQzs7b0hBNUNVLHVCQUF1Qjt3R0FBdkIsdUJBQXVCLDRRQ05wQyxtdkhBMENjOzJGRHBDRCx1QkFBdUI7a0JBTG5DLFNBQVM7K0JBQ0UscUJBQXFCOzBFQUt0QixPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csZ0JBQWdCO3NCQUF4QixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUVJLGlCQUFpQjtzQkFBMUIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1saW5rdXJsLWNvbnRyb2wnLFxuICB0ZW1wbGF0ZVVybDogJy4vbGlua3VybC1jb250cm9sLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbGlua3VybC1jb250cm9sLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBMaW5rdXJsQ29udHJvbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGVsZW1lbnQ7XG4gIEBJbnB1dCgpIGlzVXBsb2FkTXVsdGlwbGUgPSB0cnVlO1xuICBASW5wdXQoKSBtb2RlbEZpZWxkcztcbiAgQElucHV0KCkgZGF0YVZpZXc7XG4gIEBJbnB1dCgpIGRldGFpbDtcbiAgQElucHV0KCkgc3VibWl0ID0gZmFsc2U7XG4gIGlzVXBsb2FkID0gZmFsc2U7XG4gIEBPdXRwdXQoKSBjYWxsYmFja0RhdGV0aW1lcyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBjbGFzc0lucHV0ID0gZmFsc2U7XG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICB9XG5cbiAgb25DaGFuZ2VWYWx1ZShldmVudCwgZmllbGRfbmFtZSwgZWxlbWVudCkge1xuICAgIHRoaXMuaXNVcGxvYWQgPSB0cnVlO1xuICAgIHRoaXMubW9kZWxGaWVsZHNbZmllbGRfbmFtZV0uZXJyb3IgPSB0aGlzLm1vZGVsRmllbGRzW2ZpZWxkX25hbWVdLmlzUmVxdWlyZSAmJiAhdGhpcy5lbGVtZW50LmNvbHVtblZhbHVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHRoaXMubW9kZWxGaWVsZHNbZmllbGRfbmFtZV0ubWVzc2FnZSA9IHRoaXMubW9kZWxGaWVsZHNbZmllbGRfbmFtZV0uZXJyb3IgPyAnVHLGsOG7nW5nIGLhuq90IGJ14buZYyBuaOG6rXAgIScgOiAnJztcbiAgICBpZihldmVudC5jdXJyZW50RmlsZXMubGVuZ3RoID4gMCl7XG4gICAgICB0aGlzLmNhbGxiYWNrRGF0ZXRpbWVzLmVtaXQoe1xuICAgICAgICBldmVudDogZWxlbWVudCxcbiAgICAgICAgdmFsdWU6IGV2ZW50LFxuICAgICAgICBmaWVsZDogZmllbGRfbmFtZVxuICAgICAgfSlcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuaXNVcGxvYWQgPSBmYWxzZTtcbiAgICAgIH0sIDUwMCk7XG4gICAgfVxuICAgIFxuICB9XG5cbiAgaW5wdXRGb2N1cyhldmVudCkge1xuICAgIGlmICghdGhpcy5lbGVtZW50LmNvbHVtblZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlucHV0Rm9jdXNPdXQoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50LmNvbHVtblZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxufVxuIiwiPGRpdiBjbGFzcz1cImxpbmt1cmwtZHJhZ1wiPlxuICAgIDxkaXYgY2xhc3M9XCJ3cmFwLXVwbG9hZFwiPlxuICAgICAgICAgICAgICA8cC1maWxlVXBsb2FkIGFjY2VwdD1cImltYWdlL2pwZWcsaW1hZ2UvcG5nLGltYWdlL2pwZyxpbWFnZS9naWYsLm1wNCxhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldCxhcHBsaWNhdGlvbi9wZGYsYXBwbGljYXRpb24vbXN3b3JkLGFwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50LGFwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50XCIgKm5nSWY9XCIhaXNVcGxvYWRcIiBbY2hvb3NlTGFiZWxdPVwiJydcIiBbY2hvb3NlSWNvbl09XCInJ1wiICBcbiAgICAgICAgICAgICAgW211bHRpcGxlXT1cImlzVXBsb2FkTXVsdGlwbGUgPyB0cnVlIDogbnVsbFwiIFtzaG93VXBsb2FkQnV0dG9uXT1cImZhbHNlXCIgW3Nob3dDYW5jZWxCdXR0b25dPVwiZmFsc2VcIiBbY3VzdG9tVXBsb2FkXT1cInRydWVcIiBuYW1lPVwiZGVtb1tdXCIgXG4gICAgICAgICAgICAgICAob25TZWxlY3QpPVwib25DaGFuZ2VWYWx1ZSgkZXZlbnQsIGVsZW1lbnQuZmllbGRfbmFtZSwgZWxlbWVudClcIiBbbWF4RmlsZVNpemVdPVwiMTAwMDAwMDBcIj5cbiAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJ0b29sYmFyXCI+XG4gICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIHBUZW1wbGF0ZT1cImNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnQtdXBsb2FkIHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBzdHlsZT1cImNvbG9yOiAjMTgyODUwO1wiPlRhzIlpIHTDqsyjcCAmIEtlzIFvIHTDqsyjcDwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxwPlN1cHBvcnRlZCBmb3JtYXRlczogSlBFRywgUE5HLCBHSUYsIE1QNCwgUERGLCBQU0QsIEFJLCBXb3JkLCBQUFQ8L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgPC9wLWZpbGVVcGxvYWQ+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWxlLXVwbG9hZGVkXCIgKm5nSWY9XCJlbGVtZW50LmNvbHVtblZhbHVlICYmIGVsZW1lbnQuY29sdW1uVmFsdWUubGVuZ3RoID4gMFwiPlxuICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJ1cGxvYWRlZC10aXRsZVwiPsSQw6MgdXBsb2FkIHhvbmcge3sgZWxlbWVudC5jb2x1bW5WYWx1ZS5sZW5ndGggfX0gZmlsZTwvaDM+XG4gICAgICAgICAgICAgIDwhLS0gPHVsICpuZ0lmPVwidXBsb2FkZWRGaWxlcy5sZW5ndGggPiAwXCI+XG4gICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJkLWZsZXggbWlkZGxlIGJldFwiICpuZ0Zvcj1cImxldCBmaWxlIG9mIHVwbG9hZGVkRmlsZXM7IGxldCBpPWluZGV4XCI+e3tmaWxlfX0gXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIChjbGljayk9XCJyZW1vdmVJbWFnZShpKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjEyXCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDEyIDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNOS4zMzM2NiA1LjMzMzQxVjEyLjAwMDFIMi42NjY5OVY1LjMzMzQxSDkuMzMzNjZaTTguMzMzNjYgMC42NjY3NDhIMy42NjY5OUwzLjAwMDMzIDEuMzMzNDFIMC42NjY5OTJWMi42NjY3NUgxMS4zMzM3VjEuMzMzNDFIOS4wMDAzM0w4LjMzMzY2IDAuNjY2NzQ4Wk0xMC42NjcgNC4wMDAwOEgxLjMzMzY2VjEyLjAwMDFDMS4zMzM2NiAxMi43MzM0IDEuOTMzNjYgMTMuMzMzNCAyLjY2Njk5IDEzLjMzMzRIOS4zMzM2NkMxMC4wNjcgMTMuMzMzNCAxMC42NjcgMTIuNzMzNCAxMC42NjcgMTIuMDAwMVY0LjAwMDA4WlwiIGZpbGw9XCIjRkYzQjQ5XCIvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIGQ9XCJNNC4wMDAzMyAxMC4zMzM0VjYuNjY2NzVINS4zMzM2NlYxMC4zMzM0SDQuMDAwMzNaXCIgZmlsbD1cIiNGRjNCNDlcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgZD1cIk02LjY2Njk5IDEwLjMzMzRWNi42NjY3NUg4LjAwMDMzVjEwLjMzMzRINi42NjY5OVpcIiBmaWxsPVwiI0ZGM0I0OVwiLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICA8L3VsPiAtLT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPCEtLSA8ZGl2IGNsYXNzPVwiZmlsZS11cGxvYWRlZFwiICpuZ0lmPVwiZWxlbWVudC5jb2x1bW5WYWx1ZSAmJiAoZWxlbWVudC5jb2x1bW5WYWx1ZS5sZW5ndGggPiAwKSAmJiAodXBsb2FkZWRGaWxlcy5sZW5ndGggPT09IDApXCI+XG4gICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZC1mbGV4IG1pZGRsZSBiZXRcIiAqbmdGb3I9XCJsZXQgZmlsZSBvZiBlbGVtZW50LmNvbHVtblZhbHVlOyBsZXQgaT1pbmRleFwiPnt7ZmlsZX19IFxuICAgICAgICAgICAgICAgICAgPHNwYW4gKGNsaWNrKT1cInJlbW92ZUltYWdlMShpKVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxMlwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAxMiAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk05LjMzMzY2IDUuMzMzNDFWMTIuMDAwMUgyLjY2Njk5VjUuMzMzNDFIOS4zMzM2NlpNOC4zMzM2NiAwLjY2Njc0OEgzLjY2Njk5TDMuMDAwMzMgMS4zMzM0MUgwLjY2Njk5MlYyLjY2Njc1SDExLjMzMzdWMS4zMzM0MUg5LjAwMDMzTDguMzMzNjYgMC42NjY3NDhaTTEwLjY2NyA0LjAwMDA4SDEuMzMzNjZWMTIuMDAwMUMxLjMzMzY2IDEyLjczMzQgMS45MzM2NiAxMy4zMzM0IDIuNjY2OTkgMTMuMzMzNEg5LjMzMzY2QzEwLjA2NyAxMy4zMzM0IDEwLjY2NyAxMi43MzM0IDEwLjY2NyAxMi4wMDAxVjQuMDAwMDhaXCIgZmlsbD1cIiNGRjNCNDlcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIGQ9XCJNNC4wMDAzMyAxMC4zMzM0VjYuNjY2NzVINS4zMzM2NlYxMC4zMzM0SDQuMDAwMzNaXCIgZmlsbD1cIiNGRjNCNDlcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBmaWxsLXJ1bGU9XCJldmVub2RkXCIgY2xpcC1ydWxlPVwiZXZlbm9kZFwiIGQ9XCJNNi42NjY5OSAxMC4zMzM0VjYuNjY2NzVIOC4wMDAzM1YxMC4zMzM0SDYuNjY2OTlaXCIgZmlsbD1cIiNGRjNCNDlcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj4gLS0+XG4gICAgICAgIDwvZGl2PiJdfQ==