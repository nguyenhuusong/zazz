import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
export class MarkdownControlComponent {
    constructor() {
        this.classInput = false;
        this.submit = false;
        this.callbackMarkdown = new EventEmitter();
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
        this.callbackMarkdown.emit({
            event: element,
            value: event.target.value,
            field: field_name
        });
    }
}
MarkdownControlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: MarkdownControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
MarkdownControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: MarkdownControlComponent, selector: "lib-markdown-control", inputs: { element: "element", dataView: "dataView", modelFields: "modelFields", detail: "detail", submit: "submit" }, outputs: { callbackMarkdown: "callbackMarkdown" }, ngImport: i0, template: "<div class=\"row grid\">\n      <div class=\"col-12\">\n        <div class=\"row form-group grid\" >\n          <div class=\"col-12 mt-2\">\n            <md-editor class=\"md-editor-binh-luan\" id=\"content\" name=\"content\" [height]=\"'400px'\" [(ngModel)]=\"element.columnValue\"\n               maxlength=\"2500\"></md-editor>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-12\" *ngIf=\"modelMarkdow.attack\">\n        <div class=\"form-group\">\n          <label for=\"title\">T\u1EC7p \u0111\u00EDnh k\u00E8m \n            <span class=\"ml-2 attack-file\" (click)=\"handleAttackFile()\">\n              <i class=\"fa fa-paperclip\" aria-hidden=\"true\"></i>Ch\u1ECDn t\u1EC7p \u0111\u00EDnh k\u00E8m\n            </span>\n          </label>\n          <!-- <app-attack-files [notify]=\"modelMarkdow\"></app-attack-files> -->\n        </div>\n      </div>\n     \n</div>\n  ", styles: [""] });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24tY29udHJvbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL21hcmtkb3duLWNvbnRyb2wvbWFya2Rvd24tY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL21hcmtkb3duLWNvbnRyb2wvbWFya2Rvd24tY29udHJvbC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQU0vRSxNQUFNLE9BQU8sd0JBQXdCO0lBRW5DO1FBQ0EsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUtWLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZCxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBUHJDLENBQUM7SUFRakIsUUFBUTtJQUNSLENBQUM7SUFHRCxVQUFVLENBQUMsS0FBSztRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSztRQUNqQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO1lBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ3hCO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPO1FBQ3JDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLE9BQU87WUFDZCxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3pCLEtBQUssRUFBRSxVQUFVO1NBQ2xCLENBQUMsQ0FBQTtJQUNKLENBQUM7O3FIQWxDVSx3QkFBd0I7eUdBQXhCLHdCQUF3QixxT0NOckMsMDRCQXFCRTsyRkRmVyx3QkFBd0I7a0JBTHBDLFNBQVM7K0JBQ0Usc0JBQXNCOzBFQVF2QixPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0ksZ0JBQWdCO3NCQUF6QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLW1hcmtkb3duLWNvbnRyb2wnLFxuICB0ZW1wbGF0ZVVybDogJy4vbWFya2Rvd24tY29udHJvbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL21hcmtkb3duLWNvbnRyb2wuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIE1hcmtkb3duQ29udHJvbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cbiAgY2xhc3NJbnB1dCA9IGZhbHNlO1xuICBASW5wdXQoKSBlbGVtZW50O1xuICBASW5wdXQoKSBkYXRhVmlldztcbiAgQElucHV0KCkgbW9kZWxGaWVsZHM7XG4gIEBJbnB1dCgpIGRldGFpbDtcbiAgQElucHV0KCkgc3VibWl0ID0gZmFsc2U7XG4gIEBPdXRwdXQoKSBjYWxsYmFja01hcmtkb3duID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICB9XG5cbiAgXG4gIGlucHV0Rm9jdXMoZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZWxlbWVudC5jb2x1bW5WYWx1ZSkge1xuICAgICAgdGhpcy5jbGFzc0lucHV0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpbnB1dEZvY3VzT3V0KGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudC5jb2x1bW5WYWx1ZSkge1xuICAgICAgdGhpcy5jbGFzc0lucHV0ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGFzc0lucHV0ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgb25DaGFuZ2VWYWx1ZShldmVudCwgZmllbGRfbmFtZSwgZWxlbWVudCkge1xuICAgICB0aGlzLmNhbGxiYWNrTWFya2Rvd24uZW1pdCh7XG4gICAgICBldmVudDogZWxlbWVudCxcbiAgICAgIHZhbHVlOiBldmVudC50YXJnZXQudmFsdWUsXG4gICAgICBmaWVsZDogZmllbGRfbmFtZVxuICAgIH0pXG4gIH1cblxuXG59XG4iLCI8ZGl2IGNsYXNzPVwicm93IGdyaWRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBmb3JtLWdyb3VwIGdyaWRcIiA+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBtdC0yXCI+XG4gICAgICAgICAgICA8bWQtZWRpdG9yIGNsYXNzPVwibWQtZWRpdG9yLWJpbmgtbHVhblwiIGlkPVwiY29udGVudFwiIG5hbWU9XCJjb250ZW50XCIgW2hlaWdodF09XCInNDAwcHgnXCIgWyhuZ01vZGVsKV09XCJlbGVtZW50LmNvbHVtblZhbHVlXCJcbiAgICAgICAgICAgICAgIG1heGxlbmd0aD1cIjI1MDBcIj48L21kLWVkaXRvcj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTJcIiAqbmdJZj1cIm1vZGVsTWFya2Rvdy5hdHRhY2tcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICA8bGFiZWwgZm9yPVwidGl0bGVcIj5U4buHcCDEkcOtbmgga8OobSBcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWwtMiBhdHRhY2stZmlsZVwiIChjbGljayk9XCJoYW5kbGVBdHRhY2tGaWxlKClcIj5cbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wYXBlcmNsaXBcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+Q2jhu41uIHThu4dwIMSRw61uaCBrw6htXG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8IS0tIDxhcHAtYXR0YWNrLWZpbGVzIFtub3RpZnldPVwibW9kZWxNYXJrZG93XCI+PC9hcHAtYXR0YWNrLWZpbGVzPiAtLT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgXG48L2Rpdj5cbiAgIl19