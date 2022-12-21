import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachTreConComponent } from './danh-sach-tre-con.component';

describe('DanhSachTreConComponent', () => {
  let component: DanhSachTreConComponent;
  let fixture: ComponentFixture<DanhSachTreConComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachTreConComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachTreConComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
