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
IconControlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: IconControlComponent, selector: "app-icon-control", inputs: { name: "name", size: "size", fill: "fill", nzTooltipMouseEnterDelay: "nzTooltipMouseEnterDelay", nzTooltipTitle: "nzTooltipTitle" }, ngImport: i0, template: "<svg version=\"1.1\"\r\n     [style.width.px]=\"size\"\r\n     [style.height.px]=\"size\"\r\n     [style.fill]=\"fill\"\r\n     xmlns=\"http://www.w3.org/2000/svg\"\r\n     xmlns:xlink=\"http://www.w3.org/1999/xlink\">\r\n    <use [attr.xlink:href]=\"iconUrl\"></use>\r\n</svg>", styles: [""] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: IconControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-icon-control', template: "<svg version=\"1.1\"\r\n     [style.width.px]=\"size\"\r\n     [style.height.px]=\"size\"\r\n     [style.fill]=\"fill\"\r\n     xmlns=\"http://www.w3.org/2000/svg\"\r\n     xmlns:xlink=\"http://www.w3.org/1999/xlink\">\r\n    <use [attr.xlink:href]=\"iconUrl\"></use>\r\n</svg>", styles: [""] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1jb250cm9sLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3VuaS1jb250cm9sL3NyYy9saWIvaWNvbi1jb250cm9sL2ljb24tY29udHJvbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL2ljb24tY29udHJvbC9pY29uLWNvbnRyb2wuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEdBQUcsTUFBTSxlQUFlLENBQUM7O0FBTWxELE1BQU0sT0FBTyxvQkFBb0I7SUFRL0I7UUFOUyxTQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsU0FBSSxHQUFHLGNBQWMsQ0FBQztRQUN0Qiw2QkFBd0IsR0FBVyxLQUFLLENBQUM7UUFDekMsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFDN0IsV0FBTSxHQUFRLE1BQU0sQ0FBQztJQUVOLENBQUM7SUFFaEIsSUFBSSxPQUFPO1FBQ1QsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckQsQ0FBQzs7aUhBWlUsb0JBQW9CO3FHQUFwQixvQkFBb0Isc01DTmpDLHVSQU9NOzJGRERPLG9CQUFvQjtrQkFMaEMsU0FBUzsrQkFDRSxrQkFBa0I7MEVBS25CLElBQUk7c0JBQVosS0FBSztnQkFDRyxJQUFJO3NCQUFaLEtBQUs7Z0JBQ0csSUFBSTtzQkFBWixLQUFLO2dCQUNHLHdCQUF3QjtzQkFBaEMsS0FBSztnQkFDRyxjQUFjO3NCQUF0QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtaWNvbi1jb250cm9sJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vaWNvbi1jb250cm9sLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9pY29uLWNvbnRyb2wuY29tcG9uZW50LmNzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgSWNvbkNvbnRyb2xDb21wb25lbnQge1xyXG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcclxuICBASW5wdXQoKSBzaXplID0gMTY7XHJcbiAgQElucHV0KCkgZmlsbCA9ICdjdXJyZW50Q29sb3InO1xyXG4gIEBJbnB1dCgpIG56VG9vbHRpcE1vdXNlRW50ZXJEZWxheTogc3RyaW5nID0gJzAuMyc7XHJcbiAgQElucHV0KCkgbnpUb29sdGlwVGl0bGUgPSAnJztcclxuICB3aW5kb3c6IGFueSA9IHdpbmRvdztcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICBnZXQgaWNvblVybCgpIHtcclxuICAgIHJldHVybiBgJHt0aGlzLndpbmRvdy5sb2NhdGlvbi5ocmVmfSMke3RoaXMubmFtZX1gO1xyXG4gIH1cclxufVxyXG4iLCI8c3ZnIHZlcnNpb249XCIxLjFcIlxyXG4gICAgIFtzdHlsZS53aWR0aC5weF09XCJzaXplXCJcclxuICAgICBbc3R5bGUuaGVpZ2h0LnB4XT1cInNpemVcIlxyXG4gICAgIFtzdHlsZS5maWxsXT1cImZpbGxcIlxyXG4gICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPlxyXG4gICAgPHVzZSBbYXR0ci54bGluazpocmVmXT1cImljb25VcmxcIj48L3VzZT5cclxuPC9zdmc+Il19