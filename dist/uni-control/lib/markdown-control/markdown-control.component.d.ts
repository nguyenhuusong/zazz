import { EventEmitter, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class MarkdownControlComponent implements OnInit {
    constructor();
    classInput: boolean;
    element: any;
    dataView: any;
    modelFields: any;
    detail: any;
    submit: boolean;
    modelMarkdow: any;
    callbackMarkdown: EventEmitter<any>;
    ngOnInit(): void;
    handleAttackFile(): void;
    inputFocus(event: any): void;
    inputFocusOut(event: any): void;
    onChangeValue(event: any, field_name: any, element: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MarkdownControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MarkdownControlComponent, "lib-markdown-control", never, { "element": "element"; "dataView": "dataView"; "modelFields": "modelFields"; "detail": "detail"; "submit": "submit"; }, { "callbackMarkdown": "callbackMarkdown"; }, never, never>;
}
