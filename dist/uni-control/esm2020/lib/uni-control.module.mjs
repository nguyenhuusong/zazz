var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormControlDirective } from '@angular/forms';
import { TextControlModule } from './text-control/text-control.module';
import { DropdownControlModule } from './dropdown-control/dropdown-control.module';
import { CurrencyControlModule } from './currency-control/currency-control.module';
import { NumberControlModule } from './number-control/number-control.module';
import { TextAreaControlModule } from './textarea-control/textarea-control.module';
import { MarkdownControlComponent } from './markdown-control/markdown-control.component';
let UniControlModule = class UniControlModule {
};
UniControlModule = __decorate([
    NgModule({
        declarations: [
            MarkdownControlComponent
        ],
        imports: [
            CommonModule,
            FormControlDirective,
            TextControlModule,
            DropdownControlModule,
            CurrencyControlModule,
            NumberControlModule,
            TextAreaControlModule
        ],
        exports: []
    })
], UniControlModule);
export { UniControlModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pLWNvbnRyb2wubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvdW5pLWNvbnRyb2wvc3JjL2xpYi91bmktY29udHJvbC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDdkUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbkYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbkYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDN0UsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFHbkYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFrQnpGLElBQWEsZ0JBQWdCLEdBQTdCLE1BQWEsZ0JBQWdCO0NBQUksQ0FBQTtBQUFwQixnQkFBZ0I7SUFqQjVCLFFBQVEsQ0FBQztRQUNSLFlBQVksRUFBRTtZQUVaLHdCQUF3QjtTQUN6QjtRQUNELE9BQU8sRUFBRTtZQUNQLFlBQVk7WUFDWixvQkFBb0I7WUFDcEIsaUJBQWlCO1lBQ2pCLHFCQUFxQjtZQUNyQixxQkFBcUI7WUFDckIsbUJBQW1CO1lBQ25CLHFCQUFxQjtTQUN0QjtRQUNELE9BQU8sRUFBRSxFQUNSO0tBQ0YsQ0FBQztHQUNXLGdCQUFnQixDQUFJO1NBQXBCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2xEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBUZXh0Q29udHJvbE1vZHVsZSB9IGZyb20gJy4vdGV4dC1jb250cm9sL3RleHQtY29udHJvbC5tb2R1bGUnO1xuaW1wb3J0IHsgRHJvcGRvd25Db250cm9sTW9kdWxlIH0gZnJvbSAnLi9kcm9wZG93bi1jb250cm9sL2Ryb3Bkb3duLWNvbnRyb2wubW9kdWxlJztcbmltcG9ydCB7IEN1cnJlbmN5Q29udHJvbE1vZHVsZSB9IGZyb20gJy4vY3VycmVuY3ktY29udHJvbC9jdXJyZW5jeS1jb250cm9sLm1vZHVsZSc7XG5pbXBvcnQgeyBOdW1iZXJDb250cm9sTW9kdWxlIH0gZnJvbSAnLi9udW1iZXItY29udHJvbC9udW1iZXItY29udHJvbC5tb2R1bGUnO1xuaW1wb3J0IHsgVGV4dEFyZWFDb250cm9sTW9kdWxlIH0gZnJvbSAnLi90ZXh0YXJlYS1jb250cm9sL3RleHRhcmVhLWNvbnRyb2wubW9kdWxlJztcbmltcG9ydCB7IERhdGV0aW1lc0NvbnRyb2xDb21wb25lbnQgfSBmcm9tICcuL2RhdGV0aW1lcy1jb250cm9sL2RhdGV0aW1lcy1jb250cm9sLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBMaW5rdXJsQ29udHJvbENvbXBvbmVudCB9IGZyb20gJy4vbGlua3VybC1jb250cm9sL2xpbmt1cmwtY29udHJvbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWFya2Rvd25Db250cm9sQ29tcG9uZW50IH0gZnJvbSAnLi9tYXJrZG93bi1jb250cm9sL21hcmtkb3duLWNvbnRyb2wuY29tcG9uZW50JztcbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICBcbiAgICBNYXJrZG93bkNvbnRyb2xDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBGb3JtQ29udHJvbERpcmVjdGl2ZSxcbiAgICBUZXh0Q29udHJvbE1vZHVsZSxcbiAgICBEcm9wZG93bkNvbnRyb2xNb2R1bGUsXG4gICAgQ3VycmVuY3lDb250cm9sTW9kdWxlLFxuICAgIE51bWJlckNvbnRyb2xNb2R1bGUsXG4gICAgVGV4dEFyZWFDb250cm9sTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBVbmlDb250cm9sTW9kdWxlIHsgfVxuIl19