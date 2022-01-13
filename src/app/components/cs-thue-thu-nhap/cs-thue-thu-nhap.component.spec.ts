import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsThueThuNhapComponent } from './cs-thue-thu-nhap.component';

describe('CsThueThuNhapComponent', () => {
  let component: CsThueThuNhapComponent;
  let fixture: ComponentFixture<CsThueThuNhapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsThueThuNhapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsThueThuNhapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
