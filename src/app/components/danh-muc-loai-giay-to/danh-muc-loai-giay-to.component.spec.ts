import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhMucLoaiGiayToComponent } from './danh-muc-loai-giay-to.component';

describe('DanhMucLoaiGiayToComponent', () => {
  let component: DanhMucLoaiGiayToComponent;
  let fixture: ComponentFixture<DanhMucLoaiGiayToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhMucLoaiGiayToComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhMucLoaiGiayToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
