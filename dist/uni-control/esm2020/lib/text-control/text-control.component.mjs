import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "primeng/button";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
export class TextControlComponent {
    constructor() {
        this.classInput = false;
        this.submit = false;
        this.callbackText = new EventEmitter();
    }
    ngOnInit() {
    }
    inputFocus(event) {
        if (!this.element.columnValue) {
            this.classInput = true;
        }
    }
    inputFocusOut(event) {
        if (this.element.columnValue) {
            this.classInput = true;
        }
        else {
            this.classInput = false;
        }
    }
    onChangeValue(event, field_name, element) {
        this.callbackText.emit({
            event: element,
            value: event.target.value,
            field: field_name
        });
    }
    searchCustomer() {
        this.callbackText.emit({
            event: null,
            value: null,
            field: null,
            type: 'Action'
        });
    }
}
TextControlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: TextControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
TextControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: TextControlComponent, selector: "lib-text-control", inputs: { element: "element", dataView: "dataView", modelFields: "modelFields", detail: "detail", submit: "submit" }, outputs: { callbackText: "callbackText" }, ngImport: i0, template: "<div class=\"group-field\" [ngClass]=\"[element.columnValue ? 'valid' : 'invalid', classInput ? 'focused' : 'has-value', element.field_name === 'refer_saler_ref_cd' ? 'has-button': '' ]\">\n    <input type=\"text\" class=\"form-control\" [(ngModel)]=\"element.columnValue\" (change)=\"onChangeValue($event, element.field_name, element)\"\n    name={{element.field_name}} [disabled]=\"element.isDisable\"\n    (focus)=\"inputFocus($event)\" \n    (focusout)=\"inputFocusOut($event)\"\n    [required]=\"element.isRequire && element.isVisiable && !element.isEmpty\">\n    <label class=\"text-nowrap label-text\" >{{element.columnLabel}} <span style=\"color:red\" *ngIf=\"element.isRequire\">*</span></label>\n  <p-button label=\"T\u00ECm\" styleClass=\"p-button-sm\" *ngIf=\"element.field_name === 'refer_saler_ref_cd' && detail?.book_st < 2\" (click)=\"searchCustomer()\"></p-button>\n  <p-button label=\"T\u00ECm\" styleClass=\"p-button-sm h-100\" [style]=\"{'height': '100%'}\" *ngIf=\"element.field_name === 'rep_cif_no'\" (click)=\"searchCustomer()\"></p-button>\n  <div *ngIf=\"submit && modelFields[element.field_name]?.error\" class=\"alert-validation alert-danger\"> \n    <div [hidden]=\"!modelFields[element.field_name]?.error\">\n      {{modelFields[element.field_name]?.message}}\n    </div>\n  </div>\n</div> ", styles: [""], components: [{ type: i1.Button, selector: "p-button", inputs: ["type", "iconPos", "icon", "badge", "label", "disabled", "loading", "loadingIcon", "style", "styleClass", "badgeClass"], outputs: ["onClick", "onFocus", "onBlur"] }], directives: [{ type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i3.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: TextControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-text-control', template: "<div class=\"group-field\" [ngClass]=\"[element.columnValue ? 'valid' : 'invalid', classInput ? 'focused' : 'has-value', element.field_name === 'refer_saler_ref_cd' ? 'has-button': '' ]\">\n    <input type=\"text\" class=\"form-control\" [(ngModel)]=\"element.columnValue\" (change)=\"onChangeValue($event, element.field_name, element)\"\n    name={{element.field_name}} [disabled]=\"element.isDisable\"\n    (focus)=\"inputFocus($event)\" \n    (focusout)=\"inputFocusOut($event)\"\n    [required]=\"element.isRequire && element.isVisiable && !element.isEmpty\">\n    <label class=\"text-nowrap label-text\" >{{element.columnLabel}} <span style=\"color:red\" *ngIf=\"element.isRequire\">*</span></label>\n  <p-button label=\"T\u00ECm\" styleClass=\"p-button-sm\" *ngIf=\"element.field_name === 'refer_saler_ref_cd' && detail?.book_st < 2\" (click)=\"searchCustomer()\"></p-button>\n  <p-button label=\"T\u00ECm\" styleClass=\"p-button-sm h-100\" [style]=\"{'height': '100%'}\" *ngIf=\"element.field_name === 'rep_cif_no'\" (click)=\"searchCustomer()\"></p-button>\n  <div *ngIf=\"submit && modelFields[element.field_name]?.error\" class=\"alert-validation alert-danger\"> \n    <div [hidden]=\"!modelFields[element.field_name]?.error\">\n      {{modelFields[element.field_name]?.message}}\n    </div>\n  </div>\n</div> ", styles: [""] }]
        }], ctorParameters: function () { return []; }, propDecorators: { element: [{
                type: Input
            }], dataView: [{
                type: Input
            }], modelFields: [{
                type: Input
            }], detail: [{
                type: Input
            }], submit: [{
                type: Input
            }], callbackText: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC1jb250cm9sLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3VuaS1jb250cm9sL3NyYy9saWIvdGV4dC1jb250cm9sL3RleHQtY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL3RleHQtY29udHJvbC90ZXh0LWNvbnRyb2wuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFRL0UsTUFBTSxPQUFPLG9CQUFvQjtJQUUvQjtRQUNBLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFLVixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2QsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBUGpDLENBQUM7SUFRakIsUUFBUTtJQUNSLENBQUM7SUFFRCxVQUFVLENBQUMsS0FBSztRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSztRQUNqQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO1lBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPO1FBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ3RCLEtBQUssRUFBRSxPQUFPO1lBQ2QsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSztZQUN6QixLQUFLLEVBQUUsVUFBVTtTQUNsQixDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsY0FBYztRQUNaLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ3JCLEtBQUssRUFBRSxJQUFJO1lBQ1gsS0FBSyxFQUFFLElBQUk7WUFDWCxLQUFLLEVBQUUsSUFBSTtZQUNYLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQyxDQUFBO0lBQ0osQ0FBQzs7aUhBMUNVLG9CQUFvQjtxR0FBcEIsb0JBQW9CLHlOQ1JqQywweUNBY087MkZETk0sb0JBQW9CO2tCQUxoQyxTQUFTOytCQUNFLGtCQUFrQjswRUFRbkIsT0FBTztzQkFBZixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNJLFlBQVk7c0JBQXJCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBWYWxpZGF0aW9uRW1haWwsIFZhbGlkYXRpb25FbWFpbEVtcHR5LCBWYWxpZGF0aW9uUGhvbmVOdW1iZXIsIFZhbGlkYXRpb25QaG9uZU51bWJlckVtcHR5LCBWYWxpZGF0aW9uVGFpS2hvYW5OZ2FuSGFuZywgVmFsaWRhdGlvblRhaUtob2FuTmdhbkhhbmdFbXB0eSB9IGZyb20gJy4uL3ZhbGlkYXRpb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItdGV4dC1jb250cm9sJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3RleHQtY29udHJvbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3RleHQtY29udHJvbC5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgVGV4dENvbnRyb2xDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIGNsYXNzSW5wdXQgPSBmYWxzZTtcbiAgQElucHV0KCkgZWxlbWVudDtcbiAgQElucHV0KCkgZGF0YVZpZXc7XG4gIEBJbnB1dCgpIG1vZGVsRmllbGRzO1xuICBASW5wdXQoKSBkZXRhaWw7XG4gIEBJbnB1dCgpIHN1Ym1pdCA9IGZhbHNlO1xuICBAT3V0cHV0KCkgY2FsbGJhY2tUZXh0ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICB9XG5cbiAgaW5wdXRGb2N1cyhldmVudCkge1xuICAgIGlmICghdGhpcy5lbGVtZW50LmNvbHVtblZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlucHV0Rm9jdXNPdXQoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50LmNvbHVtblZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZVZhbHVlKGV2ZW50LCBmaWVsZF9uYW1lLCBlbGVtZW50KSB7XG4gICAgIHRoaXMuY2FsbGJhY2tUZXh0LmVtaXQoe1xuICAgICAgZXZlbnQ6IGVsZW1lbnQsXG4gICAgICB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlLFxuICAgICAgZmllbGQ6IGZpZWxkX25hbWVcbiAgICB9KVxuICB9XG5cbiAgc2VhcmNoQ3VzdG9tZXIoKSB7XG4gICAgdGhpcy5jYWxsYmFja1RleHQuZW1pdCh7XG4gICAgICBldmVudDogbnVsbCxcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgZmllbGQ6IG51bGwsXG4gICAgICB0eXBlOiAnQWN0aW9uJ1xuICAgIH0pXG4gIH1cblxufVxuIiwiPGRpdiBjbGFzcz1cImdyb3VwLWZpZWxkXCIgW25nQ2xhc3NdPVwiW2VsZW1lbnQuY29sdW1uVmFsdWUgPyAndmFsaWQnIDogJ2ludmFsaWQnLCBjbGFzc0lucHV0ID8gJ2ZvY3VzZWQnIDogJ2hhcy12YWx1ZScsIGVsZW1lbnQuZmllbGRfbmFtZSA9PT0gJ3JlZmVyX3NhbGVyX3JlZl9jZCcgPyAnaGFzLWJ1dHRvbic6ICcnIF1cIj5cbiAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIFsobmdNb2RlbCldPVwiZWxlbWVudC5jb2x1bW5WYWx1ZVwiIChjaGFuZ2UpPVwib25DaGFuZ2VWYWx1ZSgkZXZlbnQsIGVsZW1lbnQuZmllbGRfbmFtZSwgZWxlbWVudClcIlxuICAgIG5hbWU9e3tlbGVtZW50LmZpZWxkX25hbWV9fSBbZGlzYWJsZWRdPVwiZWxlbWVudC5pc0Rpc2FibGVcIlxuICAgIChmb2N1cyk9XCJpbnB1dEZvY3VzKCRldmVudClcIiBcbiAgICAoZm9jdXNvdXQpPVwiaW5wdXRGb2N1c091dCgkZXZlbnQpXCJcbiAgICBbcmVxdWlyZWRdPVwiZWxlbWVudC5pc1JlcXVpcmUgJiYgZWxlbWVudC5pc1Zpc2lhYmxlICYmICFlbGVtZW50LmlzRW1wdHlcIj5cbiAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LW5vd3JhcCBsYWJlbC10ZXh0XCIgPnt7ZWxlbWVudC5jb2x1bW5MYWJlbH19IDxzcGFuIHN0eWxlPVwiY29sb3I6cmVkXCIgKm5nSWY9XCJlbGVtZW50LmlzUmVxdWlyZVwiPio8L3NwYW4+PC9sYWJlbD5cbiAgPHAtYnV0dG9uIGxhYmVsPVwiVMOsbVwiIHN0eWxlQ2xhc3M9XCJwLWJ1dHRvbi1zbVwiICpuZ0lmPVwiZWxlbWVudC5maWVsZF9uYW1lID09PSAncmVmZXJfc2FsZXJfcmVmX2NkJyAmJiBkZXRhaWw/LmJvb2tfc3QgPCAyXCIgKGNsaWNrKT1cInNlYXJjaEN1c3RvbWVyKClcIj48L3AtYnV0dG9uPlxuICA8cC1idXR0b24gbGFiZWw9XCJUw6xtXCIgc3R5bGVDbGFzcz1cInAtYnV0dG9uLXNtIGgtMTAwXCIgW3N0eWxlXT1cInsnaGVpZ2h0JzogJzEwMCUnfVwiICpuZ0lmPVwiZWxlbWVudC5maWVsZF9uYW1lID09PSAncmVwX2NpZl9ubydcIiAoY2xpY2spPVwic2VhcmNoQ3VzdG9tZXIoKVwiPjwvcC1idXR0b24+XG4gIDxkaXYgKm5nSWY9XCJzdWJtaXQgJiYgbW9kZWxGaWVsZHNbZWxlbWVudC5maWVsZF9uYW1lXT8uZXJyb3JcIiBjbGFzcz1cImFsZXJ0LXZhbGlkYXRpb24gYWxlcnQtZGFuZ2VyXCI+IFxuICAgIDxkaXYgW2hpZGRlbl09XCIhbW9kZWxGaWVsZHNbZWxlbWVudC5maWVsZF9uYW1lXT8uZXJyb3JcIj5cbiAgICAgIHt7bW9kZWxGaWVsZHNbZWxlbWVudC5maWVsZF9uYW1lXT8ubWVzc2FnZX19XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+ICJdfQ==