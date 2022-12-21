import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachKhamThaiComponent } from './danh-sach-kham-thai.component';

describe('DanhSachKhamThaiComponent', () => {
  let component: DanhSachKhamThaiComponent;
  let fixture: ComponentFixture<DanhSachKhamThaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachKhamThaiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachKhamThaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
