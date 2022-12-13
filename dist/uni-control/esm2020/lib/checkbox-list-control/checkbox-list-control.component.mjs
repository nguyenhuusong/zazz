import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "primeng/checkbox";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
export class CheckboxListControlComponent {
    constructor() {
        this.classInput = false;
        this.submit = false;
        this.callbackCheckboxList = new EventEmitter();
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
        this.callbackCheckboxList.emit({
            event: element,
            value: event.target.value,
            field: field_name
        });
    }
}
CheckboxListControlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: CheckboxListControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
CheckboxListControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: CheckboxListControlComponent, selector: "lib-checkbox-list-control", inputs: { element: "element", dataView: "dataView", modelFields: "modelFields", detail: "detail", submit: "submit" }, outputs: { callbackCheckboxList: "callbackCheckboxList" }, ngImport: i0, template: "<div class=\"checkbox-default\">\n    <label class=\"text-nowrap label-text\" >{{element.columnLabel}} <span style=\"color:red\" *ngIf=\"element.isRequire\">*</span></label>\n    <div class=\"checkbox-content\">\n        <div *ngFor=\"let item of element.options\">\n            <div class=\"p-field-checkbox\" style=\"display: flex;align-items: end;\">\n                <p-checkbox name=\"{{element.field_name}}\" value=\"{{item.value}}\" [(ngModel)]=\"element.columnValue\" inputId=\"{{item.value}}\"></p-checkbox>\n                <label class=\"ml-1\" for=\"{{item.value}}\">{{item.label}}</label>\n              </div>\n          </div>\n\n    <div *ngIf=\"element.isRequire && submit && !element.columnValue\"\n        class=\"alert-validation alert-danger\">\n        <div [hidden]=\"element.columnValue\">\n        Tr\u01B0\u1EDDng b\u1EAFt bu\u1ED9c nh\u1EADp!\n        </div>\n    </div>\n</div>\n</div>", styles: [""], components: [{ type: i1.Checkbox, selector: "p-checkbox", inputs: ["value", "name", "disabled", "binary", "label", "ariaLabelledBy", "ariaLabel", "tabindex", "inputId", "style", "styleClass", "labelStyleClass", "formControl", "checkboxIcon", "readonly", "required", "trueValue", "falseValue"], outputs: ["onChange"] }], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: CheckboxListControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-checkbox-list-control', template: "<div class=\"checkbox-default\">\n    <label class=\"text-nowrap label-text\" >{{element.columnLabel}} <span style=\"color:red\" *ngIf=\"element.isRequire\">*</span></label>\n    <div class=\"checkbox-content\">\n        <div *ngFor=\"let item of element.options\">\n            <div class=\"p-field-checkbox\" style=\"display: flex;align-items: end;\">\n                <p-checkbox name=\"{{element.field_name}}\" value=\"{{item.value}}\" [(ngModel)]=\"element.columnValue\" inputId=\"{{item.value}}\"></p-checkbox>\n                <label class=\"ml-1\" for=\"{{item.value}}\">{{item.label}}</label>\n              </div>\n          </div>\n\n    <div *ngIf=\"element.isRequire && submit && !element.columnValue\"\n        class=\"alert-validation alert-danger\">\n        <div [hidden]=\"element.columnValue\">\n        Tr\u01B0\u1EDDng b\u1EAFt bu\u1ED9c nh\u1EADp!\n        </div>\n    </div>\n</div>\n</div>", styles: [""] }]
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
            }], callbackCheckboxList: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtbGlzdC1jb250cm9sLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3VuaS1jb250cm9sL3NyYy9saWIvY2hlY2tib3gtbGlzdC1jb250cm9sL2NoZWNrYm94LWxpc3QtY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL2NoZWNrYm94LWxpc3QtY29udHJvbC9jaGVja2JveC1saXN0LWNvbnRyb2wuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFNL0UsTUFBTSxPQUFPLDRCQUE0QjtJQUV2QztRQUNBLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFLVixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2QseUJBQW9CLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztJQVB6QyxDQUFDO0lBUWpCLFFBQVE7SUFDUixDQUFDO0lBR0QsVUFBVSxDQUFDLEtBQUs7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsYUFBYSxDQUFDLEtBQUs7UUFDakIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4QjthQUFNO1lBQ0wsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsYUFBYSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTztRQUNyQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO1lBQzlCLEtBQUssRUFBRSxPQUFPO1lBQ2QsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSztZQUN6QixLQUFLLEVBQUUsVUFBVTtTQUNsQixDQUFDLENBQUE7SUFDSixDQUFDOzt5SEFsQ1UsNEJBQTRCOzZHQUE1Qiw0QkFBNEIsa1BDTnpDLG01QkFpQk07MkZEWE8sNEJBQTRCO2tCQUx4QyxTQUFTOytCQUNFLDJCQUEyQjswRUFRNUIsT0FBTztzQkFBZixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNJLG9CQUFvQjtzQkFBN0IsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1jaGVja2JveC1saXN0LWNvbnRyb2wnLFxuICB0ZW1wbGF0ZVVybDogJy4vY2hlY2tib3gtbGlzdC1jb250cm9sLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vY2hlY2tib3gtbGlzdC1jb250cm9sLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDaGVja2JveExpc3RDb250cm9sQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBjbGFzc0lucHV0ID0gZmFsc2U7XG4gIEBJbnB1dCgpIGVsZW1lbnQ7XG4gIEBJbnB1dCgpIGRhdGFWaWV3O1xuICBASW5wdXQoKSBtb2RlbEZpZWxkcztcbiAgQElucHV0KCkgZGV0YWlsO1xuICBASW5wdXQoKSBzdWJtaXQgPSBmYWxzZTtcbiAgQE91dHB1dCgpIGNhbGxiYWNrQ2hlY2tib3hMaXN0ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICB9XG5cbiAgXG4gIGlucHV0Rm9jdXMoZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZWxlbWVudC5jb2x1bW5WYWx1ZSkge1xuICAgICAgdGhpcy5jbGFzc0lucHV0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpbnB1dEZvY3VzT3V0KGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudC5jb2x1bW5WYWx1ZSkge1xuICAgICAgdGhpcy5jbGFzc0lucHV0ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGFzc0lucHV0ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgb25DaGFuZ2VWYWx1ZShldmVudCwgZmllbGRfbmFtZSwgZWxlbWVudCkge1xuICAgICB0aGlzLmNhbGxiYWNrQ2hlY2tib3hMaXN0LmVtaXQoe1xuICAgICAgZXZlbnQ6IGVsZW1lbnQsXG4gICAgICB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlLFxuICAgICAgZmllbGQ6IGZpZWxkX25hbWVcbiAgICB9KVxuICB9XG5cblxufVxuIiwiPGRpdiBjbGFzcz1cImNoZWNrYm94LWRlZmF1bHRcIj5cbiAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LW5vd3JhcCBsYWJlbC10ZXh0XCIgPnt7ZWxlbWVudC5jb2x1bW5MYWJlbH19IDxzcGFuIHN0eWxlPVwiY29sb3I6cmVkXCIgKm5nSWY9XCJlbGVtZW50LmlzUmVxdWlyZVwiPio8L3NwYW4+PC9sYWJlbD5cbiAgICA8ZGl2IGNsYXNzPVwiY2hlY2tib3gtY29udGVudFwiPlxuICAgICAgICA8ZGl2ICpuZ0Zvcj1cImxldCBpdGVtIG9mIGVsZW1lbnQub3B0aW9uc1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtZmllbGQtY2hlY2tib3hcIiBzdHlsZT1cImRpc3BsYXk6IGZsZXg7YWxpZ24taXRlbXM6IGVuZDtcIj5cbiAgICAgICAgICAgICAgICA8cC1jaGVja2JveCBuYW1lPVwie3tlbGVtZW50LmZpZWxkX25hbWV9fVwiIHZhbHVlPVwie3tpdGVtLnZhbHVlfX1cIiBbKG5nTW9kZWwpXT1cImVsZW1lbnQuY29sdW1uVmFsdWVcIiBpbnB1dElkPVwie3tpdGVtLnZhbHVlfX1cIj48L3AtY2hlY2tib3g+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwibWwtMVwiIGZvcj1cInt7aXRlbS52YWx1ZX19XCI+e3tpdGVtLmxhYmVsfX08L2xhYmVsPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgIDxkaXYgKm5nSWY9XCJlbGVtZW50LmlzUmVxdWlyZSAmJiBzdWJtaXQgJiYgIWVsZW1lbnQuY29sdW1uVmFsdWVcIlxuICAgICAgICBjbGFzcz1cImFsZXJ0LXZhbGlkYXRpb24gYWxlcnQtZGFuZ2VyXCI+XG4gICAgICAgIDxkaXYgW2hpZGRlbl09XCJlbGVtZW50LmNvbHVtblZhbHVlXCI+XG4gICAgICAgIFRyxrDhu51uZyBi4bqvdCBideG7mWMgbmjhuq1wIVxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PlxuPC9kaXY+Il19