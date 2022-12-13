import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class MultiSelectControlComponent implements OnInit {
    constructor();
    classInput: boolean;
    element: any;
    dataView: any;
    modelFields: any;
    detail: any;
    submit: boolean;
    callbackMultiSelect: EventEmitter<any>;
    ngOnInit(): void;
    inputFocus(event: any): void;
    inputFocusOut(event: any): void;
    onChangeValue(event: any, field_name: any, element: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MultiSelectControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MultiSelectControlComponent, "lib-multi-select-control", never, { "element": "element"; "dataView": "dataView"; "modelFields": "modelFields"; "detail": "detail"; "submit": "submit"; }, { "callbackMultiSelect": "callbackMultiSelect"; }, never, never>;
}
