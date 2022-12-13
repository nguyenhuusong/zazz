import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class AutocompleteControlComponent implements OnInit {
    element: any;
    modelFields: any;
    dataView: any;
    detail: any;
    submit: boolean;
    callbackAutocomplete: EventEmitter<any>;
    SearchAutocomplete: EventEmitter<any>;
    constructor();
    classInput: boolean;
    ngOnInit(): void;
    onChangeValue(value: any, field_name: any, element: any): void;
    inputFocus(event: any): void;
    inputFocusOut(event: any): void;
    search($event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AutocompleteControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AutocompleteControlComponent, "lib-autocomplete-control", never, { "element": "element"; "modelFields": "modelFields"; "dataView": "dataView"; "detail": "detail"; "submit": "submit"; }, { "callbackAutocomplete": "callbackAutocomplete"; "SearchAutocomplete": "SearchAutocomplete"; }, never, never>;
}
