import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AutocompleteControlComponent } from './autocomplete-control.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import * as i0 from "@angular/core";
export class AutocompleteControlModule {
}
AutocompleteControlModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: AutocompleteControlModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AutocompleteControlModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: AutocompleteControlModule, declarations: [AutocompleteControlComponent], imports: [CommonModule,
        FormsModule,
        ButtonModule,
        AutoCompleteModule], exports: [AutocompleteControlComponent] });
AutocompleteControlModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: AutocompleteControlModule, imports: [[
            CommonModule,
            FormsModule,
            ButtonModule,
            AutoCompleteModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: AutocompleteControlModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        AutocompleteControlComponent
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        ButtonModule,
                        AutoCompleteModule
                    ],
                    exports: [
                        AutocompleteControlComponent
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLWNvbnRyb2wubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdW5pLWNvbnRyb2wvc3JjL2xpYi9hdXRvY29tcGxldGUtY29udHJvbC9hdXRvY29tcGxldGUtY29udHJvbC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBbUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFELE9BQU8sRUFBd0IsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDOztBQWUxRCxNQUFNLE9BQU8seUJBQXlCOztzSEFBekIseUJBQXlCO3VIQUF6Qix5QkFBeUIsaUJBWmxDLDRCQUE0QixhQUc1QixZQUFZO1FBQ1osV0FBVztRQUNYLFlBQVk7UUFDWixrQkFBa0IsYUFHbEIsNEJBQTRCO3VIQUduQix5QkFBeUIsWUFWM0I7WUFDUCxZQUFZO1lBQ1osV0FBVztZQUNYLFlBQVk7WUFDWixrQkFBa0I7U0FDbkI7MkZBS1UseUJBQXlCO2tCQWRyQyxRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRTt3QkFDWiw0QkFBNEI7cUJBQzdCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLFdBQVc7d0JBQ1gsWUFBWTt3QkFDWixrQkFBa0I7cUJBQ25CO29CQUNELE9BQU8sRUFBRTt3QkFDUCw0QkFBNEI7cUJBQzdCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFQUF9JTklUSUFMSVpFUiwgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sRGlyZWN0aXZlLCBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEJ1dHRvbk1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYnV0dG9uJztcbmltcG9ydCB7IEF1dG9jb21wbGV0ZUNvbnRyb2xDb21wb25lbnQgfSBmcm9tICcuL2F1dG9jb21wbGV0ZS1jb250cm9sLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBdXRvQ29tcGxldGVNb2R1bGUgfSBmcm9tICdwcmltZW5nL2F1dG9jb21wbGV0ZSc7XG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBBdXRvY29tcGxldGVDb250cm9sQ29tcG9uZW50XG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gICAgQnV0dG9uTW9kdWxlLFxuICAgIEF1dG9Db21wbGV0ZU1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQXV0b2NvbXBsZXRlQ29udHJvbENvbXBvbmVudFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEF1dG9jb21wbGV0ZUNvbnRyb2xNb2R1bGUgeyB9XG4iXX0=