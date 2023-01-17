import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachXeComponent } from './danh-sach-xe.component';

describe('DanhSachXeComponent', () => {
  let component: DanhSachXeComponent;
  let fixture: ComponentFixture<DanhSachXeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachXeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachXeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
