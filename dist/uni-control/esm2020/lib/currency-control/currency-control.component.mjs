import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
export class CurrencyControlComponent {
    constructor() {
        this.submit = false;
        this.classInput = false;
        this.callbackCurrency = new EventEmitter();
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
        this.callbackCurrency.emit({
            event: element,
            value: event.target.value,
            field: field_name
        });
    }
}
CurrencyControlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: CurrencyControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
CurrencyControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: CurrencyControlComponent, selector: "lib-currency-control", inputs: { element: "element", modelFields: "modelFields", dataView: "dataView", detail: "detail", submit: "submit" }, outputs: { callbackCurrency: "callbackCurrency" }, ngImport: i0, template: "<div class=\"group-field field-currency\"\n    [ngClass]=\"[element.columnValue || element.columnValue === 0 ? 'valid' : 'invalid']\">\n    <input maxLength=18 type=\"text\" (change)=\"onChangeValue($event, element.field_name, element)\" class=\"form-control\"\n        [(ngModel)]=\"element.columnValue\" currency name={{element.field_name}} [disabled]=\"element.isDisable\"\n        [required]=\"element.isRequire && element.isVisiable && !element.isEmpty\">\n    <label class=\"text-nowrap label-text\">{{element.columnLabel}} <span style=\"color:red\"\n            *ngIf=\"element.isRequire\">*</span></label>\n    <div *ngIf=\"modelFields[element.field_name]?.isRequire && submit && modelFields[element.field_name]?.error\"\n        class=\"alert-validation alert-danger\">\n        <div [hidden]=\"!modelFields[element.field_name]?.error\">\n            {{modelFields[element.field_name]?.message}}\n        </div>\n    </div>\n</div>", styles: [""], directives: [{ type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i2.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: CurrencyControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-currency-control', template: "<div class=\"group-field field-currency\"\n    [ngClass]=\"[element.columnValue || element.columnValue === 0 ? 'valid' : 'invalid']\">\n    <input maxLength=18 type=\"text\" (change)=\"onChangeValue($event, element.field_name, element)\" class=\"form-control\"\n        [(ngModel)]=\"element.columnValue\" currency name={{element.field_name}} [disabled]=\"element.isDisable\"\n        [required]=\"element.isRequire && element.isVisiable && !element.isEmpty\">\n    <label class=\"text-nowrap label-text\">{{element.columnLabel}} <span style=\"color:red\"\n            *ngIf=\"element.isRequire\">*</span></label>\n    <div *ngIf=\"modelFields[element.field_name]?.isRequire && submit && modelFields[element.field_name]?.error\"\n        class=\"alert-validation alert-danger\">\n        <div [hidden]=\"!modelFields[element.field_name]?.error\">\n            {{modelFields[element.field_name]?.message}}\n        </div>\n    </div>\n</div>", styles: [""] }]
        }], ctorParameters: function () { return []; }, propDecorators: { element: [{
                type: Input
            }], modelFields: [{
                type: Input
            }], dataView: [{
                type: Input
            }], detail: [{
                type: Input
            }], submit: [{
                type: Input
            }], callbackCurrency: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3ktY29udHJvbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL2N1cnJlbmN5LWNvbnRyb2wvY3VycmVuY3ktY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL2N1cnJlbmN5LWNvbnRyb2wvY3VycmVuY3ktY29udHJvbC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBTy9FLE1BQU0sT0FBTyx3QkFBd0I7SUFRbkM7UUFIUyxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDVCxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBQ3JDLENBQUM7SUFFakIsUUFBUTtJQUNSLENBQUM7SUFFRCxVQUFVLENBQUMsS0FBSztRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSztRQUNqQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO1lBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPO1FBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7WUFDekIsS0FBSyxFQUFFLE9BQU87WUFDZCxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3pCLEtBQUssRUFBRSxVQUFVO1NBQ2xCLENBQUMsQ0FBQTtJQUNKLENBQUM7O3FIQWpDVSx3QkFBd0I7eUdBQXhCLHdCQUF3QixxT0NQckMsODZCQWFNOzJGRE5PLHdCQUF3QjtrQkFMcEMsU0FBUzsrQkFDRSxzQkFBc0I7MEVBS3ZCLE9BQU87c0JBQWYsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFFSSxnQkFBZ0I7c0JBQXpCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1jdXJyZW5jeS1jb250cm9sJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2N1cnJlbmN5LWNvbnRyb2wuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jdXJyZW5jeS1jb250cm9sLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDdXJyZW5jeUNvbnRyb2xDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBlbGVtZW50O1xuICBASW5wdXQoKSBtb2RlbEZpZWxkcztcbiAgQElucHV0KCkgZGF0YVZpZXc7XG4gIEBJbnB1dCgpIGRldGFpbDtcbiAgQElucHV0KCkgc3VibWl0ID0gZmFsc2U7XG4gIGNsYXNzSW5wdXQgPSBmYWxzZTtcbiAgQE91dHB1dCgpIGNhbGxiYWNrQ3VycmVuY3kgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgfVxuXG4gIGlucHV0Rm9jdXMoZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZWxlbWVudC5jb2x1bW5WYWx1ZSkge1xuICAgICAgdGhpcy5jbGFzc0lucHV0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpbnB1dEZvY3VzT3V0KGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudC5jb2x1bW5WYWx1ZSkge1xuICAgICAgdGhpcy5jbGFzc0lucHV0ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGFzc0lucHV0ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgb25DaGFuZ2VWYWx1ZShldmVudCwgZmllbGRfbmFtZSwgZWxlbWVudCkge1xuICAgIHRoaXMuY2FsbGJhY2tDdXJyZW5jeS5lbWl0KHtcbiAgICAgIGV2ZW50OiBlbGVtZW50LFxuICAgICAgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSxcbiAgICAgIGZpZWxkOiBmaWVsZF9uYW1lXG4gICAgfSlcbiAgfVxuXG59XG4iLCI8ZGl2IGNsYXNzPVwiZ3JvdXAtZmllbGQgZmllbGQtY3VycmVuY3lcIlxuICAgIFtuZ0NsYXNzXT1cIltlbGVtZW50LmNvbHVtblZhbHVlIHx8IGVsZW1lbnQuY29sdW1uVmFsdWUgPT09IDAgPyAndmFsaWQnIDogJ2ludmFsaWQnXVwiPlxuICAgIDxpbnB1dCBtYXhMZW5ndGg9MTggdHlwZT1cInRleHRcIiAoY2hhbmdlKT1cIm9uQ2hhbmdlVmFsdWUoJGV2ZW50LCBlbGVtZW50LmZpZWxkX25hbWUsIGVsZW1lbnQpXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICBbKG5nTW9kZWwpXT1cImVsZW1lbnQuY29sdW1uVmFsdWVcIiBjdXJyZW5jeSBuYW1lPXt7ZWxlbWVudC5maWVsZF9uYW1lfX0gW2Rpc2FibGVkXT1cImVsZW1lbnQuaXNEaXNhYmxlXCJcbiAgICAgICAgW3JlcXVpcmVkXT1cImVsZW1lbnQuaXNSZXF1aXJlICYmIGVsZW1lbnQuaXNWaXNpYWJsZSAmJiAhZWxlbWVudC5pc0VtcHR5XCI+XG4gICAgPGxhYmVsIGNsYXNzPVwidGV4dC1ub3dyYXAgbGFiZWwtdGV4dFwiPnt7ZWxlbWVudC5jb2x1bW5MYWJlbH19IDxzcGFuIHN0eWxlPVwiY29sb3I6cmVkXCJcbiAgICAgICAgICAgICpuZ0lmPVwiZWxlbWVudC5pc1JlcXVpcmVcIj4qPC9zcGFuPjwvbGFiZWw+XG4gICAgPGRpdiAqbmdJZj1cIm1vZGVsRmllbGRzW2VsZW1lbnQuZmllbGRfbmFtZV0/LmlzUmVxdWlyZSAmJiBzdWJtaXQgJiYgbW9kZWxGaWVsZHNbZWxlbWVudC5maWVsZF9uYW1lXT8uZXJyb3JcIlxuICAgICAgICBjbGFzcz1cImFsZXJ0LXZhbGlkYXRpb24gYWxlcnQtZGFuZ2VyXCI+XG4gICAgICAgIDxkaXYgW2hpZGRlbl09XCIhbW9kZWxGaWVsZHNbZWxlbWVudC5maWVsZF9uYW1lXT8uZXJyb3JcIj5cbiAgICAgICAgICAgIHt7bW9kZWxGaWVsZHNbZWxlbWVudC5maWVsZF9uYW1lXT8ubWVzc2FnZX19XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+Il19