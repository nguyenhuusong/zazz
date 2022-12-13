import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "primeng/treeselect";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
export class SelectTreeControlComponent {
    constructor() {
        this.classInput = false;
        this.submit = false;
        this.callbackSelectTree = new EventEmitter();
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
        this.callbackSelectTree.emit({
            event: element,
            value: event.target.value,
            field: field_name
        });
    }
}
SelectTreeControlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: SelectTreeControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
SelectTreeControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: SelectTreeControlComponent, selector: "lib-select-tree-control", inputs: { element: "element", dataView: "dataView", modelFields: "modelFields", detail: "detail", submit: "submit" }, outputs: { callbackSelectTree: "callbackSelectTree" }, ngImport: i0, template: "<div class=\"group-dropdown\" [ngClass]=\" element.columnValue ? 'valid' : 'invalid' \">\n    <label class=\"text-nowrap label-text\" >{{element.columnLabel}} <span style=\"color:red\" *ngIf=\"element.isRequire\">*</span></label>\n    <div>\n        <p-treeSelect [(ngModel)]=\"element.columnValue\" [options]=\"element.options\" [required]=\"element.isRequire \n        && element.isVisiable \n        && !element.isEmpty\" (onNodeSelect)=\"onChangeValue($event, element.field_name, element)\"\n         [disabled]=\"element.isDisable\" selectionMode=\"single\"  placeholder=\"Select Item\"></p-treeSelect>\n          <div *ngIf=\"modelFields[element.field_name]?.isRequire && submit && modelFields[element.field_name]?.error\"\n              class=\"alert-validation alert-danger\">\n              <div [hidden]=\"!modelFields[element.field_name]?.error\">\n              {{modelFields[element.field_name]?.message}}\n              </div>\n          </div>\n</div>\n</div>", styles: [""], components: [{ type: i1.TreeSelect, selector: "p-treeSelect", inputs: ["type", "inputId", "scrollHeight", "disabled", "metaKeySelection", "display", "selectionMode", "tabindex", "ariaLabelledBy", "placeholder", "panelClass", "emptyMessage", "appendTo", "propagateSelectionDown", "propagateSelectionUp", "options", "showTransitionOptions", "hideTransitionOptions"], outputs: ["onNodeExpand", "onNodeCollapse", "onShow", "onHide", "onNodeUnselect", "onNodeSelect"] }], directives: [{ type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i3.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: SelectTreeControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-select-tree-control', template: "<div class=\"group-dropdown\" [ngClass]=\" element.columnValue ? 'valid' : 'invalid' \">\n    <label class=\"text-nowrap label-text\" >{{element.columnLabel}} <span style=\"color:red\" *ngIf=\"element.isRequire\">*</span></label>\n    <div>\n        <p-treeSelect [(ngModel)]=\"element.columnValue\" [options]=\"element.options\" [required]=\"element.isRequire \n        && element.isVisiable \n        && !element.isEmpty\" (onNodeSelect)=\"onChangeValue($event, element.field_name, element)\"\n         [disabled]=\"element.isDisable\" selectionMode=\"single\"  placeholder=\"Select Item\"></p-treeSelect>\n          <div *ngIf=\"modelFields[element.field_name]?.isRequire && submit && modelFields[element.field_name]?.error\"\n              class=\"alert-validation alert-danger\">\n              <div [hidden]=\"!modelFields[element.field_name]?.error\">\n              {{modelFields[element.field_name]?.message}}\n              </div>\n          </div>\n</div>\n</div>", styles: [""] }]
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
            }], callbackSelectTree: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXRyZWUtY29udHJvbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL3NlbGVjdC10cmVlLWNvbnRyb2wvc2VsZWN0LXRyZWUtY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL3NlbGVjdC10cmVlLWNvbnRyb2wvc2VsZWN0LXRyZWUtY29udHJvbC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQU8vRSxNQUFNLE9BQU8sMEJBQTBCO0lBRXJDO1FBQ0EsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUtWLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZCx1QkFBa0IsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBUHZDLENBQUM7SUFRakIsUUFBUTtJQUNSLENBQUM7SUFHRCxVQUFVLENBQUMsS0FBSztRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSztRQUNqQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO1lBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPO1FBQ3JDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUM7WUFDNUIsS0FBSyxFQUFFLE9BQU87WUFDZCxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3pCLEtBQUssRUFBRSxVQUFVO1NBQ2xCLENBQUMsQ0FBQTtJQUNKLENBQUM7O3VIQWxDVSwwQkFBMEI7MkdBQTFCLDBCQUEwQiw0T0NQdkMsZzlCQWNNOzJGRFBPLDBCQUEwQjtrQkFMdEMsU0FBUzsrQkFDRSx5QkFBeUI7MEVBUTFCLE9BQU87c0JBQWYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFDSSxrQkFBa0I7c0JBQTNCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1zZWxlY3QtdHJlZS1jb250cm9sJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3NlbGVjdC10cmVlLWNvbnRyb2wuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zZWxlY3QtdHJlZS1jb250cm9sLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RUcmVlQ29udHJvbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cbiAgY2xhc3NJbnB1dCA9IGZhbHNlO1xuICBASW5wdXQoKSBlbGVtZW50O1xuICBASW5wdXQoKSBkYXRhVmlldztcbiAgQElucHV0KCkgbW9kZWxGaWVsZHM7XG4gIEBJbnB1dCgpIGRldGFpbDtcbiAgQElucHV0KCkgc3VibWl0ID0gZmFsc2U7XG4gIEBPdXRwdXQoKSBjYWxsYmFja1NlbGVjdFRyZWUgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gIH1cblxuICBcbiAgaW5wdXRGb2N1cyhldmVudCkge1xuICAgIGlmICghdGhpcy5lbGVtZW50LmNvbHVtblZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlucHV0Rm9jdXNPdXQoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50LmNvbHVtblZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZVZhbHVlKGV2ZW50LCBmaWVsZF9uYW1lLCBlbGVtZW50KSB7XG4gICAgIHRoaXMuY2FsbGJhY2tTZWxlY3RUcmVlLmVtaXQoe1xuICAgICAgZXZlbnQ6IGVsZW1lbnQsXG4gICAgICB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlLFxuICAgICAgZmllbGQ6IGZpZWxkX25hbWVcbiAgICB9KVxuICB9XG5cblxufVxuIiwiPGRpdiBjbGFzcz1cImdyb3VwLWRyb3Bkb3duXCIgW25nQ2xhc3NdPVwiIGVsZW1lbnQuY29sdW1uVmFsdWUgPyAndmFsaWQnIDogJ2ludmFsaWQnIFwiPlxuICAgIDxsYWJlbCBjbGFzcz1cInRleHQtbm93cmFwIGxhYmVsLXRleHRcIiA+e3tlbGVtZW50LmNvbHVtbkxhYmVsfX0gPHNwYW4gc3R5bGU9XCJjb2xvcjpyZWRcIiAqbmdJZj1cImVsZW1lbnQuaXNSZXF1aXJlXCI+Kjwvc3Bhbj48L2xhYmVsPlxuICAgIDxkaXY+XG4gICAgICAgIDxwLXRyZWVTZWxlY3QgWyhuZ01vZGVsKV09XCJlbGVtZW50LmNvbHVtblZhbHVlXCIgW29wdGlvbnNdPVwiZWxlbWVudC5vcHRpb25zXCIgW3JlcXVpcmVkXT1cImVsZW1lbnQuaXNSZXF1aXJlIFxuICAgICAgICAmJiBlbGVtZW50LmlzVmlzaWFibGUgXG4gICAgICAgICYmICFlbGVtZW50LmlzRW1wdHlcIiAob25Ob2RlU2VsZWN0KT1cIm9uQ2hhbmdlVmFsdWUoJGV2ZW50LCBlbGVtZW50LmZpZWxkX25hbWUsIGVsZW1lbnQpXCJcbiAgICAgICAgIFtkaXNhYmxlZF09XCJlbGVtZW50LmlzRGlzYWJsZVwiIHNlbGVjdGlvbk1vZGU9XCJzaW5nbGVcIiAgcGxhY2Vob2xkZXI9XCJTZWxlY3QgSXRlbVwiPjwvcC10cmVlU2VsZWN0PlxuICAgICAgICAgIDxkaXYgKm5nSWY9XCJtb2RlbEZpZWxkc1tlbGVtZW50LmZpZWxkX25hbWVdPy5pc1JlcXVpcmUgJiYgc3VibWl0ICYmIG1vZGVsRmllbGRzW2VsZW1lbnQuZmllbGRfbmFtZV0/LmVycm9yXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJhbGVydC12YWxpZGF0aW9uIGFsZXJ0LWRhbmdlclwiPlxuICAgICAgICAgICAgICA8ZGl2IFtoaWRkZW5dPVwiIW1vZGVsRmllbGRzW2VsZW1lbnQuZmllbGRfbmFtZV0/LmVycm9yXCI+XG4gICAgICAgICAgICAgIHt7bW9kZWxGaWVsZHNbZWxlbWVudC5maWVsZF9uYW1lXT8ubWVzc2FnZX19XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuPC9kaXY+XG48L2Rpdj4iXX0=