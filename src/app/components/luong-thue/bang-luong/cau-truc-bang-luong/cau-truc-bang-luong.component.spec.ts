import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CauTrucBangLuongComponent } from './cau-truc-bang-luong.component';

describe('CauTrucBangLuongComponent', () => {
  let component: CauTrucBangLuongComponent;
  let fixture: ComponentFixture<CauTrucBangLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CauTrucBangLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CauTrucBangLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
