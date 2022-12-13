import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class NumberControlComponent implements OnInit {
    constructor();
    element: any;
    modelFields: any;
    dataView: any;
    detail: any;
    submit: boolean;
    classInput: boolean;
    callbackNumber: EventEmitter<any>;
    ngOnInit(): void;
    inputFocus(event: any): void;
    inputFocusOut(event: any): void;
    onChangeValue(event: any, field_name: any, element: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NumberControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NumberControlComponent, "lib-number-control", never, { "element": "element"; "modelFields": "modelFields"; "dataView": "dataView"; "detail": "detail"; "submit": "submit"; }, { "callbackNumber": "callbackNumber"; }, never, never>;
}
