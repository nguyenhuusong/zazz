import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DatetimesControlComponent implements OnInit {
    element: any;
    modelFields: any;
    dataView: any;
    detail: any;
    submit: boolean;
    callbackDatetimes: EventEmitter<any>;
    constructor();
    classInput: boolean;
    ngOnInit(): void;
    onChangeValue(value: any, field_name: any, element: any): void;
    inputFocus(event: any): void;
    inputFocusOut(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatetimesControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatetimesControlComponent, "lib-datetimes-control", never, { "element": "element"; "modelFields": "modelFields"; "dataView": "dataView"; "detail": "detail"; "submit": "submit"; }, { "callbackDatetimes": "callbackDatetimes"; }, never, never>;
}
