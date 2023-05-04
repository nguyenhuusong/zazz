import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NghiKhongLuongComponent } from './nghi-khong-luong.component';

describe('NghiKhongLuongComponent', () => {
  let component: NghiKhongLuongComponent;
  let fixture: ComponentFixture<NghiKhongLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NghiKhongLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NghiKhongLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
