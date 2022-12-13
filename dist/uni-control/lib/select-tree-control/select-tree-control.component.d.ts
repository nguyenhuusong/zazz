import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class SelectTreeControlComponent implements OnInit {
    constructor();
    classInput: boolean;
    element: any;
    dataView: any;
    modelFields: any;
    detail: any;
    submit: boolean;
    callbackSelectTree: EventEmitter<any>;
    ngOnInit(): void;
    inputFocus(event: any): void;
    inputFocusOut(event: any): void;
    onChangeValue(event: any, field_name: any, element: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SelectTreeControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SelectTreeControlComponent, "lib-select-tree-control", never, { "element": "element"; "dataView": "dataView"; "modelFields": "modelFields"; "detail": "detail"; "submit": "submit"; }, { "callbackSelectTree": "callbackSelectTree"; }, never, never>;
}