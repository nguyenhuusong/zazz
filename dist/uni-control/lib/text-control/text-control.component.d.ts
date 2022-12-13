import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class TextControlComponent implements OnInit {
    constructor();
    classInput: boolean;
    element: any;
    dataView: any;
    modelFields: any;
    detail: any;
    submit: boolean;
    callbackText: EventEmitter<any>;
    ngOnInit(): void;
    inputFocus(event: any): void;
    inputFocusOut(event: any): void;
    onChangeValue(event: any, field_name: any, element: any): void;
    searchCustomer(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TextControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TextControlComponent, "lib-text-control", never, { "element": "element"; "dataView": "dataView"; "modelFields": "modelFields"; "detail": "detail"; "submit": "submit"; }, { "callbackText": "callbackText"; }, never, never>;
}
