import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "ngx-markdown-editor";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/common";
export class MarkdownControlComponent {
    constructor() {
        this.classInput = false;
        this.submit = false;
        this.modelMarkdow = null;
        this.callbackMarkdown = new EventEmitter();
    }
    ngOnInit() {
    }
    handleAttackFile() {
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
        this.callbackMarkdown.emit({
            event: element,
            value: event.target.value,
            field: field_name
        });
    }
}
MarkdownControlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: MarkdownControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
MarkdownControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: MarkdownControlComponent, selector: "lib-markdown-control", inputs: { element: "element", dataView: "dataView", modelFields: "modelFields", detail: "detail", submit: "submit" }, outputs: { callbackMarkdown: "callbackMarkdown" }, ngImport: i0, template: "<div class=\"row grid\">\n      <div class=\"col-12\">\n        <div class=\"row form-group grid\" >\n          <div class=\"col-12 mt-2\">\n            <md-editor class=\"md-editor-binh-luan\" id=\"content\" name=\"content\" [height]=\"'400px'\" [(ngModel)]=\"element.columnValue\"\n               maxlength=\"2500\"></md-editor>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-12\" *ngIf=\"modelMarkdow.attack\">\n        <div class=\"form-group\">\n          <label for=\"title\">T\u1EC7p \u0111\u00EDnh k\u00E8m \n            <span class=\"ml-2 attack-file\" (click)=\"handleAttackFile()\">\n              <i class=\"fa fa-paperclip\" aria-hidden=\"true\"></i>Ch\u1ECDn t\u1EC7p \u0111\u00EDnh k\u00E8m\n            </span>\n          </label>\n          <!-- <app-attack-files [notify]=\"modelMarkdow\"></app-attack-files> -->\n        </div>\n      </div>\n     \n</div>\n  ", styles: [""], components: [{ type: i1.MarkdownEditorComponent, selector: "md-editor", inputs: ["hideToolbar", "height", "mode", "options", "preRender", "postRender", "upload"], outputs: ["onEditorLoaded", "onPreviewDomChanged"] }], directives: [{ type: i2.MaxLengthValidator, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: ["maxlength"] }, { type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: MarkdownControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-markdown-control', template: "<div class=\"row grid\">\n      <div class=\"col-12\">\n        <div class=\"row form-group grid\" >\n          <div class=\"col-12 mt-2\">\n            <md-editor class=\"md-editor-binh-luan\" id=\"content\" name=\"content\" [height]=\"'400px'\" [(ngModel)]=\"element.columnValue\"\n               maxlength=\"2500\"></md-editor>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-12\" *ngIf=\"modelMarkdow.attack\">\n        <div class=\"form-group\">\n          <label for=\"title\">T\u1EC7p \u0111\u00EDnh k\u00E8m \n            <span class=\"ml-2 attack-file\" (click)=\"handleAttackFile()\">\n              <i class=\"fa fa-paperclip\" aria-hidden=\"true\"></i>Ch\u1ECDn t\u1EC7p \u0111\u00EDnh k\u00E8m\n            </span>\n          </label>\n          <!-- <app-attack-files [notify]=\"modelMarkdow\"></app-attack-files> -->\n        </div>\n      </div>\n     \n</div>\n  ", styles: [""] }]
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
            }], callbackMarkdown: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24tY29udHJvbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL21hcmtkb3duLWNvbnRyb2wvbWFya2Rvd24tY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL21hcmtkb3duLWNvbnRyb2wvbWFya2Rvd24tY29udHJvbC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQU0vRSxNQUFNLE9BQU8sd0JBQXdCO0lBRW5DO1FBQ0EsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUtWLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDeEIsaUJBQVksR0FBRSxJQUFJLENBQUM7UUFDVCxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBUnJDLENBQUM7SUFTakIsUUFBUTtJQUNSLENBQUM7SUFHRCxnQkFBZ0I7SUFFaEIsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFLO1FBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO1lBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFLO1FBQ2pCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7YUFBTTtZQUNMLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU87UUFDckMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQztZQUMxQixLQUFLLEVBQUUsT0FBTztZQUNkLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFDekIsS0FBSyxFQUFFLFVBQVU7U0FDbEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQzs7cUhBdkNVLHdCQUF3Qjt5R0FBeEIsd0JBQXdCLHFPQ05yQywwNEJBcUJFOzJGRGZXLHdCQUF3QjtrQkFMcEMsU0FBUzsrQkFDRSxzQkFBc0I7MEVBUXZCLE9BQU87c0JBQWYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFFSSxnQkFBZ0I7c0JBQXpCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbWFya2Rvd24tY29udHJvbCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9tYXJrZG93bi1jb250cm9sLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbWFya2Rvd24tY29udHJvbC5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTWFya2Rvd25Db250cm9sQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBjbGFzc0lucHV0ID0gZmFsc2U7XG4gIEBJbnB1dCgpIGVsZW1lbnQ7XG4gIEBJbnB1dCgpIGRhdGFWaWV3O1xuICBASW5wdXQoKSBtb2RlbEZpZWxkcztcbiAgQElucHV0KCkgZGV0YWlsO1xuICBASW5wdXQoKSBzdWJtaXQgPSBmYWxzZTtcbiAgbW9kZWxNYXJrZG93PSBudWxsO1xuICBAT3V0cHV0KCkgY2FsbGJhY2tNYXJrZG93biA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgfVxuXG5cbiAgaGFuZGxlQXR0YWNrRmlsZSgpIHtcbiAgICBcbiAgfVxuICBcbiAgaW5wdXRGb2N1cyhldmVudCkge1xuICAgIGlmICghdGhpcy5lbGVtZW50LmNvbHVtblZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlucHV0Rm9jdXNPdXQoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50LmNvbHVtblZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsYXNzSW5wdXQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZVZhbHVlKGV2ZW50LCBmaWVsZF9uYW1lLCBlbGVtZW50KSB7XG4gICAgIHRoaXMuY2FsbGJhY2tNYXJrZG93bi5lbWl0KHtcbiAgICAgIGV2ZW50OiBlbGVtZW50LFxuICAgICAgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSxcbiAgICAgIGZpZWxkOiBmaWVsZF9uYW1lXG4gICAgfSlcbiAgfVxuXG5cbn1cbiIsIjxkaXYgY2xhc3M9XCJyb3cgZ3JpZFwiPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMlwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGZvcm0tZ3JvdXAgZ3JpZFwiID5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIG10LTJcIj5cbiAgICAgICAgICAgIDxtZC1lZGl0b3IgY2xhc3M9XCJtZC1lZGl0b3ItYmluaC1sdWFuXCIgaWQ9XCJjb250ZW50XCIgbmFtZT1cImNvbnRlbnRcIiBbaGVpZ2h0XT1cIic0MDBweCdcIiBbKG5nTW9kZWwpXT1cImVsZW1lbnQuY29sdW1uVmFsdWVcIlxuICAgICAgICAgICAgICAgbWF4bGVuZ3RoPVwiMjUwMFwiPjwvbWQtZWRpdG9yPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMlwiICpuZ0lmPVwibW9kZWxNYXJrZG93LmF0dGFja1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgIDxsYWJlbCBmb3I9XCJ0aXRsZVwiPlThu4dwIMSRw61uaCBrw6htIFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtbC0yIGF0dGFjay1maWxlXCIgKGNsaWNrKT1cImhhbmRsZUF0dGFja0ZpbGUoKVwiPlxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBhcGVyY2xpcFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5DaOG7jW4gdOG7h3AgxJHDrW5oIGvDqG1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwhLS0gPGFwcC1hdHRhY2stZmlsZXMgW25vdGlmeV09XCJtb2RlbE1hcmtkb3dcIj48L2FwcC1hdHRhY2stZmlsZXM+IC0tPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICBcbjwvZGl2PlxuICAiXX0=