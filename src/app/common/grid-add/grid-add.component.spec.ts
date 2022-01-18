import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridAddComponent } from './grid-add.component';

describe('GridAddComponent', () => {
  let component: GridAddComponent;
  let fixture: ComponentFixture<GridAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
