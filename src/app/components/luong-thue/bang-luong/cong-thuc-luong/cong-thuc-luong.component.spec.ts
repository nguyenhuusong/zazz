import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongThucLuongComponent } from './cong-thuc-luong.component';

describe('CongThucLuongComponent', () => {
  let component: CongThucLuongComponent;
  let fixture: ComponentFixture<CongThucLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CongThucLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CongThucLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
