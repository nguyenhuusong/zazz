import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MultiSelectControlComponent } from './multi-select-control.component';
import { MultiSelectModule } from 'primeng/multiselect';
import * as i0 from "@angular/core";
export class MultiSelectControlModule {
}
MultiSelectControlModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: MultiSelectControlModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MultiSelectControlModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: MultiSelectControlModule, declarations: [MultiSelectControlComponent], imports: [CommonModule,
        FormsModule,
        ButtonModule,
        MultiSelectModule], exports: [MultiSelectControlComponent] });
MultiSelectControlModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: MultiSelectControlModule, imports: [[
            CommonModule,
            FormsModule,
            ButtonModule,
            MultiSelectModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: MultiSelectControlModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        MultiSelectControlComponent
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        ButtonModule,
                        MultiSelectModule
                    ],
                    exports: [
                        MultiSelectControlComponent
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktc2VsZWN0LWNvbnRyb2wubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdW5pLWNvbnRyb2wvc3JjL2xpYi9tdWx0aS1zZWxlY3QtY29udHJvbC9tdWx0aS1zZWxlY3QtY29udHJvbC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBbUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFELE9BQU8sRUFBd0IsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQy9FLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDOztBQWV4RCxNQUFNLE9BQU8sd0JBQXdCOztxSEFBeEIsd0JBQXdCO3NIQUF4Qix3QkFBd0IsaUJBWmpDLDJCQUEyQixhQUczQixZQUFZO1FBQ1osV0FBVztRQUNYLFlBQVk7UUFDWixpQkFBaUIsYUFHakIsMkJBQTJCO3NIQUdsQix3QkFBd0IsWUFWMUI7WUFDUCxZQUFZO1lBQ1osV0FBVztZQUNYLFlBQVk7WUFDWixpQkFBaUI7U0FDbEI7MkZBS1Usd0JBQXdCO2tCQWRwQyxRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRTt3QkFDWiwyQkFBMkI7cUJBQzVCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLFdBQVc7d0JBQ1gsWUFBWTt3QkFDWixpQkFBaUI7cUJBQ2xCO29CQUNELE9BQU8sRUFBRTt3QkFDUCwyQkFBMkI7cUJBQzVCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFQUF9JTklUSUFMSVpFUiwgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sRGlyZWN0aXZlLCBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEJ1dHRvbk1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYnV0dG9uJztcbmltcG9ydCB7IE11bHRpU2VsZWN0Q29udHJvbENvbXBvbmVudCB9IGZyb20gJy4vbXVsdGktc2VsZWN0LWNvbnRyb2wuY29tcG9uZW50JztcbmltcG9ydCB7IE11bHRpU2VsZWN0TW9kdWxlIH0gZnJvbSAncHJpbWVuZy9tdWx0aXNlbGVjdCc7XG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNdWx0aVNlbGVjdENvbnRyb2xDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBGb3Jtc01vZHVsZSxcbiAgICBCdXR0b25Nb2R1bGUsXG4gICAgTXVsdGlTZWxlY3RNb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIE11bHRpU2VsZWN0Q29udHJvbENvbXBvbmVudFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE11bHRpU2VsZWN0Q29udHJvbE1vZHVsZSB7IH1cbiJdfQ==