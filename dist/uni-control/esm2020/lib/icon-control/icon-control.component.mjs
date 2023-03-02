import { Component, Input, } from '@angular/core';
import * as i0 from "@angular/core";
export class IconControlComponent {
    constructor() {
        this.size = 16;
        this.fill = 'currentColor';
        this.nzTooltipMouseEnterDelay = '0.3';
        this.nzTooltipTitle = '';
        this.window = window;
    }
    get iconUrl() {
        return `${this.window.location.href}#${this.name}`;
    }
}
IconControlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: IconControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IconControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: IconControlComponent, selector: "svg-icon", inputs: { name: "name", size: "size", fill: "fill", nzTooltipMouseEnterDelay: "nzTooltipMouseEnterDelay", nzTooltipTitle: "nzTooltipTitle" }, ngImport: i0, template: "<svg version=\"1.1\"\r\n     [style.width.px]=\"size\"\r\n     [style.height.px]=\"size\"\r\n     [style.fill]=\"fill\"\r\n     xmlns=\"http://www.w3.org/2000/svg\"\r\n     xmlns:xlink=\"http://www.w3.org/1999/xlink\">\r\n    <use [attr.xlink:href]=\"iconUrl\"></use>\r\n</svg>", styles: [""] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: IconControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'svg-icon', template: "<svg version=\"1.1\"\r\n     [style.width.px]=\"size\"\r\n     [style.height.px]=\"size\"\r\n     [style.fill]=\"fill\"\r\n     xmlns=\"http://www.w3.org/2000/svg\"\r\n     xmlns:xlink=\"http://www.w3.org/1999/xlink\">\r\n    <use [attr.xlink:href]=\"iconUrl\"></use>\r\n</svg>", styles: [""] }]
        }], ctorParameters: function () { return []; }, propDecorators: { name: [{
                type: Input
            }], size: [{
                type: Input
            }], fill: [{
                type: Input
            }], nzTooltipMouseEnterDelay: [{
                type: Input
            }], nzTooltipTitle: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1jb250cm9sLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3VuaS1jb250cm9sL3NyYy9saWIvaWNvbi1jb250cm9sL2ljb24tY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL2ljb24tY29udHJvbC9pY29uLWNvbnRyb2wuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEdBQUcsTUFBTSxlQUFlLENBQUM7O0FBTWxELE1BQU0sT0FBTyxvQkFBb0I7SUFRL0I7UUFOUyxTQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsU0FBSSxHQUFHLGNBQWMsQ0FBQztRQUN0Qiw2QkFBd0IsR0FBVyxLQUFLLENBQUM7UUFDekMsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFDN0IsV0FBTSxHQUFRLE1BQU0sQ0FBQztJQUVOLENBQUM7SUFFaEIsSUFBSSxPQUFPO1FBQ1QsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckQsQ0FBQzs7aUhBWlUsb0JBQW9CO3FHQUFwQixvQkFBb0IsOExDTmpDLHVSQU9NOzJGRERPLG9CQUFvQjtrQkFMaEMsU0FBUzsrQkFDRSxVQUFVOzBFQUtYLElBQUk7c0JBQVosS0FBSztnQkFDRyxJQUFJO3NCQUFaLEtBQUs7Z0JBQ0csSUFBSTtzQkFBWixLQUFLO2dCQUNHLHdCQUF3QjtzQkFBaEMsS0FBSztnQkFDRyxjQUFjO3NCQUF0QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdzdmctaWNvbicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2ljb24tY29udHJvbC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vaWNvbi1jb250cm9sLmNvbXBvbmVudC5jc3MnXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEljb25Db250cm9sQ29tcG9uZW50IHtcclxuICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgc2l6ZSA9IDE2O1xyXG4gIEBJbnB1dCgpIGZpbGwgPSAnY3VycmVudENvbG9yJztcclxuICBASW5wdXQoKSBuelRvb2x0aXBNb3VzZUVudGVyRGVsYXk6IHN0cmluZyA9ICcwLjMnO1xyXG4gIEBJbnB1dCgpIG56VG9vbHRpcFRpdGxlID0gJyc7XHJcbiAgd2luZG93OiBhbnkgPSB3aW5kb3c7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgZ2V0IGljb25VcmwoKSB7XHJcbiAgICByZXR1cm4gYCR7dGhpcy53aW5kb3cubG9jYXRpb24uaHJlZn0jJHt0aGlzLm5hbWV9YDtcclxuICB9XHJcbn1cclxuIiwiPHN2ZyB2ZXJzaW9uPVwiMS4xXCJcclxuICAgICBbc3R5bGUud2lkdGgucHhdPVwic2l6ZVwiXHJcbiAgICAgW3N0eWxlLmhlaWdodC5weF09XCJzaXplXCJcclxuICAgICBbc3R5bGUuZmlsbF09XCJmaWxsXCJcclxuICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj5cclxuICAgIDx1c2UgW2F0dHIueGxpbms6aHJlZl09XCJpY29uVXJsXCI+PC91c2U+XHJcbjwvc3ZnPiJdfQ==