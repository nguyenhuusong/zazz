import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuaTrinhHocVanComponent } from './qua-trinh-hoc-van.component';

describe('QuaTrinhHocVanComponent', () => {
  let component: QuaTrinhHocVanComponent;
  let fixture: ComponentFixture<QuaTrinhHocVanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuaTrinhHocVanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuaTrinhHocVanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
