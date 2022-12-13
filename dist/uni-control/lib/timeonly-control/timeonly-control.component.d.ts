import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class TimeonlyControlComponent implements OnInit {
    element: any;
    modelFields: any;
    dataView: any;
    detail: any;
    submit: boolean;
    callbackTimeonly: EventEmitter<any>;
    constructor();
    classInput: boolean;
    ngOnInit(): void;
    onChangeValue(value: any, field_name: any, element: any): void;
    inputFocus(event: any): void;
    inputFocusOut(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeonlyControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimeonlyControlComponent, "lib-timeonly-control", never, { "element": "element"; "modelFields": "modelFields"; "dataView": "dataView"; "detail": "detail"; "submit": "submit"; }, { "callbackTimeonly": "callbackTimeonly"; }, never, never>;
}
