import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachActionComponent } from './danh-sach-action.component';

describe('DanhSachActionComponent', () => {
  let component: DanhSachActionComponent;
  let fixture: ComponentFixture<DanhSachActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
