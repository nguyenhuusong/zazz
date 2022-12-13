import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "primeng/multiselect";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/common";
export class MultiSelectControlComponent {
    constructor() {
        this.classInput = false;
        this.submit = false;
        this.callbackMultiSelect = new EventEmitter();
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
        this.callbackMultiSelect.emit({
            event: element,
            value: event.value,
            field: field_name
        });
    }
}
MultiSelectControlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: MultiSelectControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
MultiSelectControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: MultiSelectControlComponent, selector: "lib-multi-select-control", inputs: { element: "element", dataView: "dataView", modelFields: "modelFields", detail: "detail", submit: "submit" }, outputs: { callbackMultiSelect: "callbackMultiSelect" }, ngImport: i0, template: "<div class=\"group-field multi-select\">\n    <p-multiSelect [options]=\"element.options\" [(ngModel)]=\"element.columnValue\" [appendTo]=\"'body'\"  (onChange)=\"onChangeValue($event, element.field_name, element)\"\n    name={{element.field_name}} defaultLabel=\"Select a option\" optionLabel=\"name\" display=\"chip\">\n  </p-multiSelect>\n  <label class=\"text-nowrap label-text\" >{{element.columnLabel}} <span style=\"color:red\" *ngIf=\"element.isRequire\">*</span></label>\n\n  <div *ngIf=\"modelFields[element.field_name]?.isRequire && submit && modelFields[element.field_name]?.error\"\n          class=\"alert-validation alert-danger\">\n          <div [hidden]=\"!modelFields[element.field_name]?.error\">\n          {{modelFields[element.field_name]?.message}}\n          </div>\n   </div>\n</div>", styles: [""], components: [{ type: i1.MultiSelect, selector: "p-multiSelect", inputs: ["style", "styleClass", "panelStyle", "panelStyleClass", "inputId", "disabled", "readonly", "group", "filter", "filterPlaceHolder", "filterLocale", "overlayVisible", "tabindex", "appendTo", "dataKey", "name", "ariaLabelledBy", "displaySelectedLabel", "maxSelectedLabels", "selectionLimit", "selectedItemsLabel", "showToggleAll", "emptyFilterMessage", "emptyMessage", "resetFilterOnHide", "dropdownIcon", "optionLabel", "optionValue", "optionDisabled", "optionGroupLabel", "optionGroupChildren", "showHeader", "autoZIndex", "baseZIndex", "filterBy", "virtualScroll", "itemSize", "showTransitionOptions", "hideTransitionOptions", "ariaFilterLabel", "filterMatchMode", "tooltip", "tooltipPosition", "tooltipPositionStyle", "tooltipStyleClass", "autofocusFilter", "display", "scrollHeight", "defaultLabel", "placeholder", "options", "filterValue"], outputs: ["onChange", "onFilter", "onFocus", "onBlur", "onClick", "onPanelShow", "onPanelHide"] }], directives: [{ type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: MultiSelectControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-multi-select-control', template: "<div class=\"group-field multi-select\">\n    <p-multiSelect [options]=\"element.options\" [(ngModel)]=\"element.columnValue\" [appendTo]=\"'body'\"  (onChange)=\"onChangeValue($event, element.field_name, element)\"\n    name={{element.field_name}} defaultLabel=\"Select a option\" optionLabel=\"name\" display=\"chip\">\n  </p-multiSelect>\n  <label class=\"text-nowrap label-text\" >{{element.columnLabel}} <span style=\"color:red\" *ngIf=\"element.isRequire\">*</span></label>\n\n  <div *ngIf=\"modelFields[element.field_name]?.isRequire && submit && modelFields[element.field_name]?.error\"\n          class=\"alert-validation alert-danger\">\n          <div [hidden]=\"!modelFields[element.field_name]?.error\">\n          {{modelFields[element.field_name]?.message}}\n          </div>\n   </div>\n</div>", styles: [""] }]
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
            }], callbackMultiSelect: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktc2VsZWN0LWNvbnRyb2wuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdW5pLWNvbnRyb2wvc3JjL2xpYi9tdWx0aS1zZWxlY3QtY29udHJvbC9tdWx0aS1zZWxlY3QtY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL211bHRpLXNlbGVjdC1jb250cm9sL211bHRpLXNlbGVjdC1jb250cm9sLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7O0FBTy9FLE1BQU0sT0FBTywyQkFBMkI7SUFFdEM7UUFDQSxlQUFVLEdBQUcsS0FBSyxDQUFDO1FBS1YsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNkLHdCQUFtQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7SUFQeEMsQ0FBQztJQVFqQixRQUFRO0lBQ1IsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFLO1FBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO1lBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFLO1FBQ2pCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7YUFBTTtZQUNMLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU87UUFDckMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQztZQUM3QixLQUFLLEVBQUUsT0FBTztZQUNkLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztZQUNsQixLQUFLLEVBQUUsVUFBVTtTQUNsQixDQUFDLENBQUE7SUFDSixDQUFDOzt3SEFqQ1UsMkJBQTJCOzRHQUEzQiwyQkFBMkIsK09DUHhDLDJ5QkFZTTsyRkRMTywyQkFBMkI7a0JBTHZDLFNBQVM7K0JBQ0UsMEJBQTBCOzBFQVEzQixPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0ksbUJBQW1CO3NCQUE1QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbXVsdGktc2VsZWN0LWNvbnRyb2wnLFxuICB0ZW1wbGF0ZVVybDogJy4vbXVsdGktc2VsZWN0LWNvbnRyb2wuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9tdWx0aS1zZWxlY3QtY29udHJvbC5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTXVsdGlTZWxlY3RDb250cm9sQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBjbGFzc0lucHV0ID0gZmFsc2U7XG4gIEBJbnB1dCgpIGVsZW1lbnQ7XG4gIEBJbnB1dCgpIGRhdGFWaWV3O1xuICBASW5wdXQoKSBtb2RlbEZpZWxkcztcbiAgQElucHV0KCkgZGV0YWlsO1xuICBASW5wdXQoKSBzdWJtaXQgPSBmYWxzZTtcbiAgQE91dHB1dCgpIGNhbGxiYWNrTXVsdGlTZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gIH1cblxuICBpbnB1dEZvY3VzKGV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmVsZW1lbnQuY29sdW1uVmFsdWUpIHtcbiAgICAgIHRoaXMuY2xhc3NJbnB1dCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaW5wdXRGb2N1c091dChldmVudCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnQuY29sdW1uVmFsdWUpIHtcbiAgICAgIHRoaXMuY2xhc3NJbnB1dCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xhc3NJbnB1dCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2hhbmdlVmFsdWUoZXZlbnQsIGZpZWxkX25hbWUsIGVsZW1lbnQpIHtcbiAgICAgdGhpcy5jYWxsYmFja011bHRpU2VsZWN0LmVtaXQoe1xuICAgICAgZXZlbnQ6IGVsZW1lbnQsXG4gICAgICB2YWx1ZTogZXZlbnQudmFsdWUsXG4gICAgICBmaWVsZDogZmllbGRfbmFtZVxuICAgIH0pXG4gIH1cblxufVxuIiwiPGRpdiBjbGFzcz1cImdyb3VwLWZpZWxkIG11bHRpLXNlbGVjdFwiPlxuICAgIDxwLW11bHRpU2VsZWN0IFtvcHRpb25zXT1cImVsZW1lbnQub3B0aW9uc1wiIFsobmdNb2RlbCldPVwiZWxlbWVudC5jb2x1bW5WYWx1ZVwiIFthcHBlbmRUb109XCInYm9keSdcIiAgKG9uQ2hhbmdlKT1cIm9uQ2hhbmdlVmFsdWUoJGV2ZW50LCBlbGVtZW50LmZpZWxkX25hbWUsIGVsZW1lbnQpXCJcbiAgICBuYW1lPXt7ZWxlbWVudC5maWVsZF9uYW1lfX0gZGVmYXVsdExhYmVsPVwiU2VsZWN0IGEgb3B0aW9uXCIgb3B0aW9uTGFiZWw9XCJuYW1lXCIgZGlzcGxheT1cImNoaXBcIj5cbiAgPC9wLW11bHRpU2VsZWN0PlxuICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LW5vd3JhcCBsYWJlbC10ZXh0XCIgPnt7ZWxlbWVudC5jb2x1bW5MYWJlbH19IDxzcGFuIHN0eWxlPVwiY29sb3I6cmVkXCIgKm5nSWY9XCJlbGVtZW50LmlzUmVxdWlyZVwiPio8L3NwYW4+PC9sYWJlbD5cblxuICA8ZGl2ICpuZ0lmPVwibW9kZWxGaWVsZHNbZWxlbWVudC5maWVsZF9uYW1lXT8uaXNSZXF1aXJlICYmIHN1Ym1pdCAmJiBtb2RlbEZpZWxkc1tlbGVtZW50LmZpZWxkX25hbWVdPy5lcnJvclwiXG4gICAgICAgICAgY2xhc3M9XCJhbGVydC12YWxpZGF0aW9uIGFsZXJ0LWRhbmdlclwiPlxuICAgICAgICAgIDxkaXYgW2hpZGRlbl09XCIhbW9kZWxGaWVsZHNbZWxlbWVudC5maWVsZF9uYW1lXT8uZXJyb3JcIj5cbiAgICAgICAgICB7e21vZGVsRmllbGRzW2VsZW1lbnQuZmllbGRfbmFtZV0/Lm1lc3NhZ2V9fVxuICAgICAgICAgIDwvZGl2PlxuICAgPC9kaXY+XG48L2Rpdj4iXX0=