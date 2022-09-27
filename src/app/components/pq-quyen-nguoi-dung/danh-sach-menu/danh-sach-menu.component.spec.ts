import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachMenuComponent } from './danh-sach-menu.component';

describe('DanhSachMenuComponent', () => {
  let component: DanhSachMenuComponent;
  let fixture: ComponentFixture<DanhSachMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
