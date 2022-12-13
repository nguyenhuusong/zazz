import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "primeng/autocomplete";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
export class AutocompleteControlComponent {
    constructor() {
        this.submit = false;
        this.callbackAutocomplete = new EventEmitter();
        this.SearchAutocomplete = new EventEmitter();
        this.classInput = false;
    }
    ngOnInit() {
    }
    onChangeValue(value, field_name, element) {
        this.modelFields[field_name].error = this.modelFields[field_name].isRequire && !this.element.columnValue ? true : false;
        this.modelFields[field_name].message = this.modelFields[field_name].error ? 'Trường bắt buộc nhập !' : '';
        this.callbackAutocomplete.emit({
            event: element,
            value: value,
            field: field_name
        });
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
    search($event) {
    }
}
AutocompleteControlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: AutocompleteControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
AutocompleteControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: AutocompleteControlComponent, selector: "lib-autocomplete-control", inputs: { element: "element", modelFields: "modelFields", dataView: "dataView", detail: "detail", submit: "submit" }, outputs: { callbackAutocomplete: "callbackAutocomplete", SearchAutocomplete: "SearchAutocomplete" }, ngImport: i0, template: "<div class=\"input-group\">\n    <label class=\"text-nowrap label-text\">{{element.columnLabel}} <span style=\"color:red\"\n            *ngIf=\"element.isRequire\">*</span></label>\n    <div>\n        <p-autoComplete [(ngModel)]=\"element.columnValue\" [disabled]=\"element.isDisable\" name={{element.field_name}} [baseZIndex]=\"100\"\n            [appendTo]=\"'body'\" [style]=\"{width: '100%'}\" [suggestions]=\"element.options\"\n            placeholder=\"Nh\u1EADp T\u00ECm ki\u1EBFm theo t\u00EAn\" (onSelect)=\"onChangeValue($event.value, element.field_name, element)\"\n            (completeMethod)=\"search($event)\" field=\"name\"\n            [required]=\"element.isRequire && element.isVisiable && !element.isEmpty\"></p-autoComplete>\n        <div *ngIf=\"modelFields[element.field_name]?.isRequire && submit && modelFields[element.field_name]?.error\"\n            class=\"alert-validation alert-danger\">\n            <div [hidden]=\"!modelFields[element.field_name]?.error\">\n                {{modelFields[element.field_name]?.message}}\n            </div>\n        </div>\n    </div>\n</div>", styles: [""], components: [{ type: i1.AutoComplete, selector: "p-autoComplete", inputs: ["minLength", "delay", "style", "panelStyle", "styleClass", "panelStyleClass", "inputStyle", "inputId", "inputStyleClass", "placeholder", "readonly", "disabled", "virtualScroll", "itemSize", "maxlength", "name", "required", "size", "appendTo", "autoHighlight", "forceSelection", "type", "autoZIndex", "baseZIndex", "ariaLabel", "dropdownAriaLabel", "ariaLabelledBy", "dropdownIcon", "unique", "group", "completeOnFocus", "field", "scrollHeight", "dropdown", "showEmptyMessage", "dropdownMode", "multiple", "tabindex", "dataKey", "emptyMessage", "showTransitionOptions", "hideTransitionOptions", "autofocus", "autocomplete", "optionGroupChildren", "optionGroupLabel", "suggestions"], outputs: ["completeMethod", "onSelect", "onUnselect", "onFocus", "onBlur", "onDropdownClick", "onClear", "onKeyUp", "onShow", "onHide"] }], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i3.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: AutocompleteControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-autocomplete-control', template: "<div class=\"input-group\">\n    <label class=\"text-nowrap label-text\">{{element.columnLabel}} <span style=\"color:red\"\n            *ngIf=\"element.isRequire\">*</span></label>\n    <div>\n        <p-autoComplete [(ngModel)]=\"element.columnValue\" [disabled]=\"element.isDisable\" name={{element.field_name}} [baseZIndex]=\"100\"\n            [appendTo]=\"'body'\" [style]=\"{width: '100%'}\" [suggestions]=\"element.options\"\n            placeholder=\"Nh\u1EADp T\u00ECm ki\u1EBFm theo t\u00EAn\" (onSelect)=\"onChangeValue($event.value, element.field_name, element)\"\n            (completeMethod)=\"search($event)\" field=\"name\"\n            [required]=\"element.isRequire && element.isVisiable && !element.isEmpty\"></p-autoComplete>\n        <div *ngIf=\"modelFields[element.field_name]?.isRequire && submit && modelFields[element.field_name]?.error\"\n            class=\"alert-validation alert-danger\">\n            <div [hidden]=\"!modelFields[element.field_name]?.error\">\n                {{modelFields[element.field_name]?.message}}\n            </div>\n        </div>\n    </div>\n</div>", styles: [""] }]
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
            }], callbackAutocomplete: [{
                type: Output
            }], SearchAutocomplete: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWNvbnRyb2wuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdW5pLWNvbnRyb2wvc3JjL2xpYi9hdXRvY29tcGxldGUtY29udHJvbC9hdXRvY29tcGxldGUtY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL2F1dG9jb21wbGV0ZS1jb250cm9sL2F1dG9jb21wbGV0ZS1jb250cm9sLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7O0FBTy9FLE1BQU0sT0FBTyw0QkFBNEI7SUFRdkM7UUFIUyxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2QseUJBQW9CLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUMvQyx1QkFBa0IsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRXZELGVBQVUsR0FBRyxLQUFLLENBQUM7SUFESCxDQUFDO0lBRWpCLFFBQVE7SUFDUixDQUFDO0lBRUQsYUFBYSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTztRQUN0QyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN4SCxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtRQUN6RyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDO1lBQzdCLEtBQUssRUFBRSxPQUFPO1lBQ2QsS0FBSyxFQUFFLEtBQUs7WUFDWixLQUFLLEVBQUUsVUFBVTtTQUNsQixDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQUs7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsYUFBYSxDQUFDLEtBQUs7UUFDakIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4QjthQUFNO1lBQ0wsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU07SUFFYixDQUFDOzt5SEF2Q1UsNEJBQTRCOzZHQUE1Qiw0QkFBNEIsMlJDUnpDLHNsQ0FnQk07MkZEUk8sNEJBQTRCO2tCQUx4QyxTQUFTOytCQUNFLDBCQUEwQjswRUFLM0IsT0FBTztzQkFBZixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNJLG9CQUFvQjtzQkFBN0IsTUFBTTtnQkFDRyxrQkFBa0I7c0JBQTNCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLWF1dG9jb21wbGV0ZS1jb250cm9sJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2F1dG9jb21wbGV0ZS1jb250cm9sLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vYXV0b2NvbXBsZXRlLWNvbnRyb2wuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIEF1dG9jb21wbGV0ZUNvbnRyb2xDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBlbGVtZW50O1xuICBASW5wdXQoKSBtb2RlbEZpZWxkcztcbiAgQElucHV0KCkgZGF0YVZpZXc7XG4gIEBJbnB1dCgpIGRldGFpbDtcbiAgQElucHV0KCkgc3VibWl0ID0gZmFsc2U7XG4gIEBPdXRwdXQoKSBjYWxsYmFja0F1dG9jb21wbGV0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgU2VhcmNoQXV0b2NvbXBsZXRlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIGNsYXNzSW5wdXQgPSBmYWxzZTtcbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gIH1cblxuICBvbkNoYW5nZVZhbHVlKHZhbHVlLCBmaWVsZF9uYW1lLCBlbGVtZW50KSB7XG4gICAgdGhpcy5tb2RlbEZpZWxkc1tmaWVsZF9uYW1lXS5lcnJvciA9IHRoaXMubW9kZWxGaWVsZHNbZmllbGRfbmFtZV0uaXNSZXF1aXJlICYmICF0aGlzLmVsZW1lbnQuY29sdW1uVmFsdWUgPyB0cnVlIDogZmFsc2U7XG4gICAgdGhpcy5tb2RlbEZpZWxkc1tmaWVsZF9uYW1lXS5tZXNzYWdlID0gdGhpcy5tb2RlbEZpZWxkc1tmaWVsZF9uYW1lXS5lcnJvciA/ICdUcsaw4budbmcgYuG6r3QgYnXhu5ljIG5o4bqtcCAhJyA6ICcnXG4gICAgdGhpcy5jYWxsYmFja0F1dG9jb21wbGV0ZS5lbWl0KHtcbiAgICAgIGV2ZW50OiBlbGVtZW50LFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZmllbGQ6IGZpZWxkX25hbWVcbiAgICB9KVxuICB9XG5cbiAgaW5wdXRGb2N1cyhldmVudCkge1xuICAgIGlmICghdGhpcy5lbGVtZW50LmNvbHVtblZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlucHV0Rm9jdXNPdXQoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50LmNvbHVtblZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBzZWFyY2goJGV2ZW50KSB7XG5cbiAgfVxuXG59XG4iLCI8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LW5vd3JhcCBsYWJlbC10ZXh0XCI+e3tlbGVtZW50LmNvbHVtbkxhYmVsfX0gPHNwYW4gc3R5bGU9XCJjb2xvcjpyZWRcIlxuICAgICAgICAgICAgKm5nSWY9XCJlbGVtZW50LmlzUmVxdWlyZVwiPio8L3NwYW4+PC9sYWJlbD5cbiAgICA8ZGl2PlxuICAgICAgICA8cC1hdXRvQ29tcGxldGUgWyhuZ01vZGVsKV09XCJlbGVtZW50LmNvbHVtblZhbHVlXCIgW2Rpc2FibGVkXT1cImVsZW1lbnQuaXNEaXNhYmxlXCIgbmFtZT17e2VsZW1lbnQuZmllbGRfbmFtZX19IFtiYXNlWkluZGV4XT1cIjEwMFwiXG4gICAgICAgICAgICBbYXBwZW5kVG9dPVwiJ2JvZHknXCIgW3N0eWxlXT1cInt3aWR0aDogJzEwMCUnfVwiIFtzdWdnZXN0aW9uc109XCJlbGVtZW50Lm9wdGlvbnNcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJOaOG6rXAgVMOsbSBraeG6v20gdGhlbyB0w6puXCIgKG9uU2VsZWN0KT1cIm9uQ2hhbmdlVmFsdWUoJGV2ZW50LnZhbHVlLCBlbGVtZW50LmZpZWxkX25hbWUsIGVsZW1lbnQpXCJcbiAgICAgICAgICAgIChjb21wbGV0ZU1ldGhvZCk9XCJzZWFyY2goJGV2ZW50KVwiIGZpZWxkPVwibmFtZVwiXG4gICAgICAgICAgICBbcmVxdWlyZWRdPVwiZWxlbWVudC5pc1JlcXVpcmUgJiYgZWxlbWVudC5pc1Zpc2lhYmxlICYmICFlbGVtZW50LmlzRW1wdHlcIj48L3AtYXV0b0NvbXBsZXRlPlxuICAgICAgICA8ZGl2ICpuZ0lmPVwibW9kZWxGaWVsZHNbZWxlbWVudC5maWVsZF9uYW1lXT8uaXNSZXF1aXJlICYmIHN1Ym1pdCAmJiBtb2RlbEZpZWxkc1tlbGVtZW50LmZpZWxkX25hbWVdPy5lcnJvclwiXG4gICAgICAgICAgICBjbGFzcz1cImFsZXJ0LXZhbGlkYXRpb24gYWxlcnQtZGFuZ2VyXCI+XG4gICAgICAgICAgICA8ZGl2IFtoaWRkZW5dPVwiIW1vZGVsRmllbGRzW2VsZW1lbnQuZmllbGRfbmFtZV0/LmVycm9yXCI+XG4gICAgICAgICAgICAgICAge3ttb2RlbEZpZWxkc1tlbGVtZW50LmZpZWxkX25hbWVdPy5tZXNzYWdlfX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbjwvZGl2PiJdfQ==