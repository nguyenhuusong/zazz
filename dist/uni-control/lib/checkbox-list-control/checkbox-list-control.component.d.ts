import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class CheckboxListControlComponent implements OnInit {
    constructor();
    classInput: boolean;
    element: any;
    dataView: any;
    modelFields: any;
    detail: any;
    submit: boolean;
    callbackCheckboxList: EventEmitter<any>;
    ngOnInit(): void;
    inputFocus(event: any): void;
    inputFocusOut(event: any): void;
    onChangeValue(event: any, field_name: any, element: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CheckboxListControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CheckboxListControlComponent, "lib-checkbox-list-control", never, { "element": "element"; "dataView": "dataView"; "modelFields": "modelFields"; "detail": "detail"; "submit": "submit"; }, { "callbackCheckboxList": "callbackCheckboxList"; }, never, never>;
}
