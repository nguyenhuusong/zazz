import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "primeng/checkbox";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
export class CheckboxControlComponent {
    constructor() {
        this.classInput = false;
        this.submit = false;
        this.callbackCheckbox = new EventEmitter();
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
        this.callbackCheckbox.emit({
            event: element,
            value: event.target.value,
            field: field_name
        });
    }
}
CheckboxControlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: CheckboxControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
CheckboxControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: CheckboxControlComponent, selector: "lib-checkbox-control", inputs: { element: "element", dataView: "dataView", modelFields: "modelFields", detail: "detail", submit: "submit" }, outputs: { callbackCheckbox: "callbackCheckbox" }, ngImport: i0, template: "<div class=\"checkbox-default\">\n    <label class=\"text-nowrap label-text\" >{{element.columnLabel}} <span style=\"color:red\" *ngIf=\"element.isRequire\">*</span></label>\n    <div class=\"checkbox-content\">\n      <p-checkbox name={{element.field_name}} [binary]=\"true\" label=\"{{element.columnLabel}}\"\n      [required]=\"element.isRequire && element.isVisiable && !element.isEmpty\" [disabled]=\"element.isDisable\"\n      [(ngModel)]=\"element.columnValue\"></p-checkbox>\n\n    <div *ngIf=\"element.isRequire && submit && !element.columnValue\"\n        class=\"alert-validation alert-danger\">\n        <div [hidden]=\"element.columnValue\">\n        Tr\u01B0\u1EDDng b\u1EAFt bu\u1ED9c nh\u1EADp!\n        </div>\n    </div>\n</div>\n</div>", styles: [""], components: [{ type: i1.Checkbox, selector: "p-checkbox", inputs: ["value", "name", "disabled", "binary", "label", "ariaLabelledBy", "ariaLabel", "tabindex", "inputId", "style", "styleClass", "labelStyleClass", "formControl", "checkboxIcon", "readonly", "required", "trueValue", "falseValue"], outputs: ["onChange"] }], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i3.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: CheckboxControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-checkbox-control', template: "<div class=\"checkbox-default\">\n    <label class=\"text-nowrap label-text\" >{{element.columnLabel}} <span style=\"color:red\" *ngIf=\"element.isRequire\">*</span></label>\n    <div class=\"checkbox-content\">\n      <p-checkbox name={{element.field_name}} [binary]=\"true\" label=\"{{element.columnLabel}}\"\n      [required]=\"element.isRequire && element.isVisiable && !element.isEmpty\" [disabled]=\"element.isDisable\"\n      [(ngModel)]=\"element.columnValue\"></p-checkbox>\n\n    <div *ngIf=\"element.isRequire && submit && !element.columnValue\"\n        class=\"alert-validation alert-danger\">\n        <div [hidden]=\"element.columnValue\">\n        Tr\u01B0\u1EDDng b\u1EAFt bu\u1ED9c nh\u1EADp!\n        </div>\n    </div>\n</div>\n</div>", styles: [""] }]
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
            }], callbackCheckbox: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtY29udHJvbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL2NoZWNrYm94LWNvbnRyb2wvY2hlY2tib3gtY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL2NoZWNrYm94LWNvbnRyb2wvY2hlY2tib3gtY29udHJvbC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQU8vRSxNQUFNLE9BQU8sd0JBQXdCO0lBRW5DO1FBQ0EsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUtWLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZCxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBUHJDLENBQUM7SUFRakIsUUFBUTtJQUNSLENBQUM7SUFHRCxVQUFVLENBQUMsS0FBSztRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSztRQUNqQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO1lBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPO1FBQ3JDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLE9BQU87WUFDZCxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3pCLEtBQUssRUFBRSxVQUFVO1NBQ2xCLENBQUMsQ0FBQTtJQUNKLENBQUM7O3FIQWxDVSx3QkFBd0I7eUdBQXhCLHdCQUF3QixxT0NSckMsb3ZCQWNNOzJGRE5PLHdCQUF3QjtrQkFMcEMsU0FBUzsrQkFDRSxzQkFBc0I7MEVBUXZCLE9BQU87c0JBQWYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFDSSxnQkFBZ0I7c0JBQXpCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLWNoZWNrYm94LWNvbnRyb2wnLFxuICB0ZW1wbGF0ZVVybDogJy4vY2hlY2tib3gtY29udHJvbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NoZWNrYm94LWNvbnRyb2wuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIENoZWNrYm94Q29udHJvbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cbiAgY2xhc3NJbnB1dCA9IGZhbHNlO1xuICBASW5wdXQoKSBlbGVtZW50O1xuICBASW5wdXQoKSBkYXRhVmlldztcbiAgQElucHV0KCkgbW9kZWxGaWVsZHM7XG4gIEBJbnB1dCgpIGRldGFpbDtcbiAgQElucHV0KCkgc3VibWl0ID0gZmFsc2U7XG4gIEBPdXRwdXQoKSBjYWxsYmFja0NoZWNrYm94ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICB9XG5cbiAgXG4gIGlucHV0Rm9jdXMoZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZWxlbWVudC5jb2x1bW5WYWx1ZSkge1xuICAgICAgdGhpcy5jbGFzc0lucHV0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpbnB1dEZvY3VzT3V0KGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudC5jb2x1bW5WYWx1ZSkge1xuICAgICAgdGhpcy5jbGFzc0lucHV0ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGFzc0lucHV0ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgb25DaGFuZ2VWYWx1ZShldmVudCwgZmllbGRfbmFtZSwgZWxlbWVudCkge1xuICAgICB0aGlzLmNhbGxiYWNrQ2hlY2tib3guZW1pdCh7XG4gICAgICBldmVudDogZWxlbWVudCxcbiAgICAgIHZhbHVlOiBldmVudC50YXJnZXQudmFsdWUsXG4gICAgICBmaWVsZDogZmllbGRfbmFtZVxuICAgIH0pXG4gIH1cblxuXG59XG4iLCI8ZGl2IGNsYXNzPVwiY2hlY2tib3gtZGVmYXVsdFwiPlxuICAgIDxsYWJlbCBjbGFzcz1cInRleHQtbm93cmFwIGxhYmVsLXRleHRcIiA+e3tlbGVtZW50LmNvbHVtbkxhYmVsfX0gPHNwYW4gc3R5bGU9XCJjb2xvcjpyZWRcIiAqbmdJZj1cImVsZW1lbnQuaXNSZXF1aXJlXCI+Kjwvc3Bhbj48L2xhYmVsPlxuICAgIDxkaXYgY2xhc3M9XCJjaGVja2JveC1jb250ZW50XCI+XG4gICAgICA8cC1jaGVja2JveCBuYW1lPXt7ZWxlbWVudC5maWVsZF9uYW1lfX0gW2JpbmFyeV09XCJ0cnVlXCIgbGFiZWw9XCJ7e2VsZW1lbnQuY29sdW1uTGFiZWx9fVwiXG4gICAgICBbcmVxdWlyZWRdPVwiZWxlbWVudC5pc1JlcXVpcmUgJiYgZWxlbWVudC5pc1Zpc2lhYmxlICYmICFlbGVtZW50LmlzRW1wdHlcIiBbZGlzYWJsZWRdPVwiZWxlbWVudC5pc0Rpc2FibGVcIlxuICAgICAgWyhuZ01vZGVsKV09XCJlbGVtZW50LmNvbHVtblZhbHVlXCI+PC9wLWNoZWNrYm94PlxuXG4gICAgPGRpdiAqbmdJZj1cImVsZW1lbnQuaXNSZXF1aXJlICYmIHN1Ym1pdCAmJiAhZWxlbWVudC5jb2x1bW5WYWx1ZVwiXG4gICAgICAgIGNsYXNzPVwiYWxlcnQtdmFsaWRhdGlvbiBhbGVydC1kYW5nZXJcIj5cbiAgICAgICAgPGRpdiBbaGlkZGVuXT1cImVsZW1lbnQuY29sdW1uVmFsdWVcIj5cbiAgICAgICAgVHLGsOG7nW5nIGLhuq90IGJ14buZYyBuaOG6rXAhXG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuPC9kaXY+XG48L2Rpdj4iXX0=