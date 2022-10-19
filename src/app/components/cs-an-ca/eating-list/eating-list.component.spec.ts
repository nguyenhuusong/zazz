import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EatingListComponent } from './eating-list.component';

describe('EatingListComponent', () => {
  let component: EatingListComponent;
  let fixture: ComponentFixture<EatingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EatingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EatingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
