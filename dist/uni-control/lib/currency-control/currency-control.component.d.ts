import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class CurrencyControlComponent implements OnInit {
    element: any;
    modelFields: any;
    dataView: any;
    detail: any;
    submit: boolean;
    classInput: boolean;
    callbackCurrency: EventEmitter<any>;
    constructor();
    ngOnInit(): void;
    inputFocus(event: any): void;
    inputFocusOut(event: any): void;
    onChangeValue(event: any, field_name: any, element: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CurrencyControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CurrencyControlComponent, "lib-currency-control", never, { "element": "element"; "modelFields": "modelFields"; "dataView": "dataView"; "detail": "detail"; "submit": "submit"; }, { "callbackCurrency": "callbackCurrency"; }, never, never>;
}
