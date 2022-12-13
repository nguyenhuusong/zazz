import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class LinkurlControlComponent implements OnInit {
    element: any;
    isUploadMultiple: boolean;
    modelFields: any;
    dataView: any;
    detail: any;
    submit: boolean;
    isUpload: boolean;
    callbackDatetimes: EventEmitter<any>;
    constructor();
    classInput: boolean;
    ngOnInit(): void;
    onChangeValue(event: any, field_name: any, element: any): void;
    inputFocus(event: any): void;
    inputFocusOut(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LinkurlControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LinkurlControlComponent, "lib-linkurl-control", never, { "element": "element"; "isUploadMultiple": "isUploadMultiple"; "modelFields": "modelFields"; "dataView": "dataView"; "detail": "detail"; "submit": "submit"; }, { "callbackDatetimes": "callbackDatetimes"; }, never, never>;
}
