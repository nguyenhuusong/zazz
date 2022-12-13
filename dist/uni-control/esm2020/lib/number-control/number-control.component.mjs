import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
export class NumberControlComponent {
    constructor() {
        this.submit = false;
        this.classInput = false;
        this.callbackNumber = new EventEmitter();
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
        this.callbackNumber.emit({
            event: element,
            value: event.target.value,
            field: field_name
        });
    }
}
NumberControlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NumberControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
NumberControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: NumberControlComponent, selector: "lib-number-control", inputs: { element: "element", modelFields: "modelFields", dataView: "dataView", detail: "detail", submit: "submit" }, outputs: { callbackNumber: "callbackNumber" }, ngImport: i0, template: "<div class=\"input-group\">\n    <label class=\"text-nowrap label-text\" >{{element.columnLabel}} <span style=\"color:red\" *ngIf=\"element.isRequire\">*</span></label>\n    <div>\n      <input type=\"number\" class=\"form-control\" [(ngModel)]=\"element.columnValue\"\n      name={{element.field_name}} [disabled]=\"element.isDisable\" (change)=\"onChangeValue($event, element.field_name, element)\"\n      [required]=\"element.isRequire && element.isVisiable && !element.isEmpty\">\n\n      <div *ngIf=\"modelFields[element.field_name]?.isRequire && submit && modelFields[element.field_name]?.error\"\n            class=\"alert-validation alert-danger\">\n            <div [hidden]=\"!modelFields[element.field_name]?.error\">\n            {{modelFields[element.field_name]?.message}}\n            </div>\n      </div>\n  </div>\n</div>", styles: [""], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i2.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NumberControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-number-control', template: "<div class=\"input-group\">\n    <label class=\"text-nowrap label-text\" >{{element.columnLabel}} <span style=\"color:red\" *ngIf=\"element.isRequire\">*</span></label>\n    <div>\n      <input type=\"number\" class=\"form-control\" [(ngModel)]=\"element.columnValue\"\n      name={{element.field_name}} [disabled]=\"element.isDisable\" (change)=\"onChangeValue($event, element.field_name, element)\"\n      [required]=\"element.isRequire && element.isVisiable && !element.isEmpty\">\n\n      <div *ngIf=\"modelFields[element.field_name]?.isRequire && submit && modelFields[element.field_name]?.error\"\n            class=\"alert-validation alert-danger\">\n            <div [hidden]=\"!modelFields[element.field_name]?.error\">\n            {{modelFields[element.field_name]?.message}}\n            </div>\n      </div>\n  </div>\n</div>", styles: [""] }]
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
            }], callbackNumber: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyLWNvbnRyb2wuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdW5pLWNvbnRyb2wvc3JjL2xpYi9udW1iZXItY29udHJvbC9udW1iZXItY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL251bWJlci1jb250cm9sL251bWJlci1jb250cm9sLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFPL0UsTUFBTSxPQUFPLHNCQUFzQjtJQUVqQztRQUtTLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDeEIsZUFBVSxHQUFHLEtBQUssQ0FBQTtRQUNSLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztJQVBuQyxDQUFDO0lBUWpCLFFBQVE7SUFDUixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQUs7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsYUFBYSxDQUFDLEtBQUs7UUFDakIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4QjthQUFNO1lBQ0wsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsYUFBYSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTztRQUN0QyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztZQUN2QixLQUFLLEVBQUUsT0FBTztZQUNkLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFDekIsS0FBSyxFQUFFLFVBQVU7U0FDbEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQzs7bUhBakNVLHNCQUFzQjt1R0FBdEIsc0JBQXNCLCtOQ1BuQyx3MEJBY007MkZEUE8sc0JBQXNCO2tCQUxsQyxTQUFTOytCQUNFLG9CQUFvQjswRUFPckIsT0FBTztzQkFBZixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUVJLGNBQWM7c0JBQXZCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1udW1iZXItY29udHJvbCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9udW1iZXItY29udHJvbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL251bWJlci1jb250cm9sLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBOdW1iZXJDb250cm9sQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBASW5wdXQoKSBlbGVtZW50O1xuICBASW5wdXQoKSBtb2RlbEZpZWxkcztcbiAgQElucHV0KCkgZGF0YVZpZXc7XG4gIEBJbnB1dCgpIGRldGFpbDtcbiAgQElucHV0KCkgc3VibWl0ID0gZmFsc2U7XG4gIGNsYXNzSW5wdXQgPSBmYWxzZVxuICBAT3V0cHV0KCkgY2FsbGJhY2tOdW1iZXIgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gIH1cblxuICBpbnB1dEZvY3VzKGV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmVsZW1lbnQuY29sdW1uVmFsdWUpIHtcbiAgICAgIHRoaXMuY2xhc3NJbnB1dCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaW5wdXRGb2N1c091dChldmVudCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnQuY29sdW1uVmFsdWUpIHtcbiAgICAgIHRoaXMuY2xhc3NJbnB1dCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xhc3NJbnB1dCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2hhbmdlVmFsdWUoZXZlbnQsIGZpZWxkX25hbWUsIGVsZW1lbnQpIHtcbiAgICB0aGlzLmNhbGxiYWNrTnVtYmVyLmVtaXQoe1xuICAgICAgZXZlbnQ6IGVsZW1lbnQsXG4gICAgICB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlLFxuICAgICAgZmllbGQ6IGZpZWxkX25hbWVcbiAgICB9KVxuICB9XG5cbn1cbiIsIjxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxuICAgIDxsYWJlbCBjbGFzcz1cInRleHQtbm93cmFwIGxhYmVsLXRleHRcIiA+e3tlbGVtZW50LmNvbHVtbkxhYmVsfX0gPHNwYW4gc3R5bGU9XCJjb2xvcjpyZWRcIiAqbmdJZj1cImVsZW1lbnQuaXNSZXF1aXJlXCI+Kjwvc3Bhbj48L2xhYmVsPlxuICAgIDxkaXY+XG4gICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgWyhuZ01vZGVsKV09XCJlbGVtZW50LmNvbHVtblZhbHVlXCJcbiAgICAgIG5hbWU9e3tlbGVtZW50LmZpZWxkX25hbWV9fSBbZGlzYWJsZWRdPVwiZWxlbWVudC5pc0Rpc2FibGVcIiAoY2hhbmdlKT1cIm9uQ2hhbmdlVmFsdWUoJGV2ZW50LCBlbGVtZW50LmZpZWxkX25hbWUsIGVsZW1lbnQpXCJcbiAgICAgIFtyZXF1aXJlZF09XCJlbGVtZW50LmlzUmVxdWlyZSAmJiBlbGVtZW50LmlzVmlzaWFibGUgJiYgIWVsZW1lbnQuaXNFbXB0eVwiPlxuXG4gICAgICA8ZGl2ICpuZ0lmPVwibW9kZWxGaWVsZHNbZWxlbWVudC5maWVsZF9uYW1lXT8uaXNSZXF1aXJlICYmIHN1Ym1pdCAmJiBtb2RlbEZpZWxkc1tlbGVtZW50LmZpZWxkX25hbWVdPy5lcnJvclwiXG4gICAgICAgICAgICBjbGFzcz1cImFsZXJ0LXZhbGlkYXRpb24gYWxlcnQtZGFuZ2VyXCI+XG4gICAgICAgICAgICA8ZGl2IFtoaWRkZW5dPVwiIW1vZGVsRmllbGRzW2VsZW1lbnQuZmllbGRfbmFtZV0/LmVycm9yXCI+XG4gICAgICAgICAgICB7e21vZGVsRmllbGRzW2VsZW1lbnQuZmllbGRfbmFtZV0/Lm1lc3NhZ2V9fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj4iXX0=