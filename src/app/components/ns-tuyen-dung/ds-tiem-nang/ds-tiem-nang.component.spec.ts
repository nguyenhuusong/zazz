import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsTiemNangComponent } from './ds-tiem-nang.component';

describe('DsTiemNangComponent', () => {
  let component: DsTiemNangComponent;
  let fixture: ComponentFixture<DsTiemNangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsTiemNangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsTiemNangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
