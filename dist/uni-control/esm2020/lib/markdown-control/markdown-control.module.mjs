import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { ButtonModule } from 'primeng/button';
import { TreeSelectModule } from 'primeng/treeselect';
import { MarkdownControlComponent } from './markdown-control.component';
import * as i0 from "@angular/core";
export class MarkdownControlModule {
}
MarkdownControlModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: MarkdownControlModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MarkdownControlModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: MarkdownControlModule, declarations: [MarkdownControlComponent], imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        TreeSelectModule,
        LMarkdownEditorModule], exports: [MarkdownControlComponent] });
MarkdownControlModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: MarkdownControlModule, imports: [[
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            ButtonModule,
            TreeSelectModule,
            LMarkdownEditorModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: MarkdownControlModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        MarkdownControlComponent
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        ButtonModule,
                        TreeSelectModule,
                        LMarkdownEditorModule
                    ],
                    exports: [
                        MarkdownControlComponent
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24tY29udHJvbC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91bmktY29udHJvbC9zcmMvbGliL21hcmtkb3duLWNvbnRyb2wvbWFya2Rvd24tY29udHJvbC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzVELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7QUFpQnhFLE1BQU0sT0FBTyxxQkFBcUI7O2tIQUFyQixxQkFBcUI7bUhBQXJCLHFCQUFxQixpQkFkOUIsd0JBQXdCLGFBR3hCLFlBQVk7UUFDWixXQUFXO1FBQ1gsbUJBQW1CO1FBQ25CLFlBQVk7UUFDWixnQkFBZ0I7UUFDaEIscUJBQXFCLGFBR3JCLHdCQUF3QjttSEFHZixxQkFBcUIsWUFadkI7WUFDUCxZQUFZO1lBQ1osV0FBVztZQUNYLG1CQUFtQjtZQUNuQixZQUFZO1lBQ1osZ0JBQWdCO1lBQ2hCLHFCQUFxQjtTQUN0QjsyRkFLVSxxQkFBcUI7a0JBaEJqQyxRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRTt3QkFDWix3QkFBd0I7cUJBQ3pCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLFdBQVc7d0JBQ1gsbUJBQW1CO3dCQUNuQixZQUFZO3dCQUNaLGdCQUFnQjt3QkFDaEIscUJBQXFCO3FCQUN0QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1Asd0JBQXdCO3FCQUN6QjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBMTWFya2Rvd25FZGl0b3JNb2R1bGUgfSBmcm9tICduZ3gtbWFya2Rvd24tZWRpdG9yJztcbmltcG9ydCB7IEJ1dHRvbk1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYnV0dG9uJztcbmltcG9ydCB7IFRyZWVTZWxlY3RNb2R1bGUgfSBmcm9tICdwcmltZW5nL3RyZWVzZWxlY3QnO1xuaW1wb3J0IHsgTWFya2Rvd25Db250cm9sQ29tcG9uZW50IH0gZnJvbSAnLi9tYXJrZG93bi1jb250cm9sLmNvbXBvbmVudCc7XG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXJrZG93bkNvbnRyb2xDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBGb3Jtc01vZHVsZSxcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgIEJ1dHRvbk1vZHVsZSxcbiAgICBUcmVlU2VsZWN0TW9kdWxlLFxuICAgIExNYXJrZG93bkVkaXRvck1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgTWFya2Rvd25Db250cm9sQ29tcG9uZW50XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWFya2Rvd25Db250cm9sTW9kdWxlIHsgfVxuIl19