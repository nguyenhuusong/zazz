import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachRoleComponent } from './danh-sach-role.component';

describe('DanhSachRoleComponent', () => {
  let component: DanhSachRoleComponent;
  let fixture: ComponentFixture<DanhSachRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
