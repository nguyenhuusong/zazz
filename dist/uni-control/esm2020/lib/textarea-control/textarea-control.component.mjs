import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
export class TextareaControlComponent {
    constructor() {
        this.classInput = false;
        this.submit = false;
        this.callbackInput = new EventEmitter();
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
        this.callbackInput.emit({
            event: element,
            value: event.target.value,
            field: field_name
        });
    }
}
TextareaControlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: TextareaControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
TextareaControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: TextareaControlComponent, selector: "lib-textarea-control", inputs: { element: "element", dataView: "dataView", modelFields: "modelFields", detail: "detail", submit: "submit" }, outputs: { callbackInput: "callbackInput" }, ngImport: i0, template: "<div class=\"group-textarea\">\n    <label class=\"text-nowrap label-text\">{{element.columnLabel}} <span style=\"color:red\"\n            *ngIf=\"element.isRequire\">*</span></label>\n    <div>\n        <textarea type=\"text\" placeholder=\"\" class=\"form-control\" (change)=\"onChangeValue($event, element.field_name, element)\"\n            [(ngModel)]=\"element.columnValue\" name={{element.field_name}} [disabled]=\"element.isDisable\"\n            [required]=\"element.isRequire && element.isVisiable && !element.isEmpty\"></textarea>\n\n        <div *ngIf=\"modelFields[element.field_name]?.isRequire && submit && modelFields[element.field_name]?.error\"\n            class=\"alert-validation alert-danger\">\n            <div [hidden]=\"!modelFields[element.field_name]?.error\">\n                {{modelFields[element.field_name]?.message}}\n            </div>\n        </div>\n    </div>\n</div>", styles: [""], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i2.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: TextareaControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-textarea-control', template: "<div class=\"group-textarea\">\n    <label class=\"text-nowrap label-text\">{{element.columnLabel}} <span style=\"color:red\"\n            *ngIf=\"element.isRequire\">*</span></label>\n    <div>\n        <textarea type=\"text\" placeholder=\"\" class=\"form-control\" (change)=\"onChangeValue($event, element.field_name, element)\"\n            [(ngModel)]=\"element.columnValue\" name={{element.field_name}} [disabled]=\"element.isDisable\"\n            [required]=\"element.isRequire && element.isVisiable && !element.isEmpty\"></textarea>\n\n        <div *ngIf=\"modelFields[element.field_name]?.isRequire && submit && modelFields[element.field_name]?.error\"\n            class=\"alert-validation alert-danger\">\n            <div [hidden]=\"!modelFields[element.field_name]?.error\">\n                {{modelFields[element.field_name]?.message}}\n            </div>\n        </div>\n    </div>\n</div>", styles: [""] }]
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
            }], callbackInput: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dGFyZWEtY29udHJvbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL3RleHRhcmVhLWNvbnRyb2wvdGV4dGFyZWEtY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL3RleHRhcmVhLWNvbnRyb2wvdGV4dGFyZWEtY29udHJvbC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBTy9FLE1BQU0sT0FBTyx3QkFBd0I7SUFFbkM7UUFDQSxlQUFVLEdBQUcsS0FBSyxDQUFDO1FBS1YsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNkLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztJQVBsQyxDQUFDO0lBUWpCLFFBQVE7SUFDUixDQUFDO0lBR0QsVUFBVSxDQUFDLEtBQUs7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsYUFBYSxDQUFDLEtBQUs7UUFDakIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4QjthQUFNO1lBQ0wsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsYUFBYSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTztRQUNyQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztZQUN2QixLQUFLLEVBQUUsT0FBTztZQUNkLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFDekIsS0FBSyxFQUFFLFVBQVU7U0FDbEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQzs7cUhBbENVLHdCQUF3Qjt5R0FBeEIsd0JBQXdCLCtOQ1ByQyw0NEJBZU07MkZEUk8sd0JBQXdCO2tCQUxwQyxTQUFTOytCQUNFLHNCQUFzQjswRUFRdkIsT0FBTztzQkFBZixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNJLGFBQWE7c0JBQXRCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi10ZXh0YXJlYS1jb250cm9sJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3RleHRhcmVhLWNvbnRyb2wuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi90ZXh0YXJlYS1jb250cm9sLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBUZXh0YXJlYUNvbnRyb2xDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIGNsYXNzSW5wdXQgPSBmYWxzZTtcbiAgQElucHV0KCkgZWxlbWVudDtcbiAgQElucHV0KCkgZGF0YVZpZXc7XG4gIEBJbnB1dCgpIG1vZGVsRmllbGRzO1xuICBASW5wdXQoKSBkZXRhaWw7XG4gIEBJbnB1dCgpIHN1Ym1pdCA9IGZhbHNlO1xuICBAT3V0cHV0KCkgY2FsbGJhY2tJbnB1dCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgfVxuXG4gIFxuICBpbnB1dEZvY3VzKGV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmVsZW1lbnQuY29sdW1uVmFsdWUpIHtcbiAgICAgIHRoaXMuY2xhc3NJbnB1dCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaW5wdXRGb2N1c091dChldmVudCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnQuY29sdW1uVmFsdWUpIHtcbiAgICAgIHRoaXMuY2xhc3NJbnB1dCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xhc3NJbnB1dCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2hhbmdlVmFsdWUoZXZlbnQsIGZpZWxkX25hbWUsIGVsZW1lbnQpIHtcbiAgICAgdGhpcy5jYWxsYmFja0lucHV0LmVtaXQoe1xuICAgICAgZXZlbnQ6IGVsZW1lbnQsXG4gICAgICB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlLFxuICAgICAgZmllbGQ6IGZpZWxkX25hbWVcbiAgICB9KVxuICB9XG5cblxufVxuIiwiPGRpdiBjbGFzcz1cImdyb3VwLXRleHRhcmVhXCI+XG4gICAgPGxhYmVsIGNsYXNzPVwidGV4dC1ub3dyYXAgbGFiZWwtdGV4dFwiPnt7ZWxlbWVudC5jb2x1bW5MYWJlbH19IDxzcGFuIHN0eWxlPVwiY29sb3I6cmVkXCJcbiAgICAgICAgICAgICpuZ0lmPVwiZWxlbWVudC5pc1JlcXVpcmVcIj4qPC9zcGFuPjwvbGFiZWw+XG4gICAgPGRpdj5cbiAgICAgICAgPHRleHRhcmVhIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIChjaGFuZ2UpPVwib25DaGFuZ2VWYWx1ZSgkZXZlbnQsIGVsZW1lbnQuZmllbGRfbmFtZSwgZWxlbWVudClcIlxuICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJlbGVtZW50LmNvbHVtblZhbHVlXCIgbmFtZT17e2VsZW1lbnQuZmllbGRfbmFtZX19IFtkaXNhYmxlZF09XCJlbGVtZW50LmlzRGlzYWJsZVwiXG4gICAgICAgICAgICBbcmVxdWlyZWRdPVwiZWxlbWVudC5pc1JlcXVpcmUgJiYgZWxlbWVudC5pc1Zpc2lhYmxlICYmICFlbGVtZW50LmlzRW1wdHlcIj48L3RleHRhcmVhPlxuXG4gICAgICAgIDxkaXYgKm5nSWY9XCJtb2RlbEZpZWxkc1tlbGVtZW50LmZpZWxkX25hbWVdPy5pc1JlcXVpcmUgJiYgc3VibWl0ICYmIG1vZGVsRmllbGRzW2VsZW1lbnQuZmllbGRfbmFtZV0/LmVycm9yXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYWxlcnQtdmFsaWRhdGlvbiBhbGVydC1kYW5nZXJcIj5cbiAgICAgICAgICAgIDxkaXYgW2hpZGRlbl09XCIhbW9kZWxGaWVsZHNbZWxlbWVudC5maWVsZF9uYW1lXT8uZXJyb3JcIj5cbiAgICAgICAgICAgICAgICB7e21vZGVsRmllbGRzW2VsZW1lbnQuZmllbGRfbmFtZV0/Lm1lc3NhZ2V9fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+Il19