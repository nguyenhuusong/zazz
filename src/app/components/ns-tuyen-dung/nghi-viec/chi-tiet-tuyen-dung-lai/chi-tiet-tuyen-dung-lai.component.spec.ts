import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietTuyenDungLaiComponent } from './chi-tiet-tuyen-dung-lai.component';

describe('ChiTietTuyenDungLaiComponent', () => {
  let component: ChiTietTuyenDungLaiComponent;
  let fixture: ComponentFixture<ChiTietTuyenDungLaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietTuyenDungLaiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietTuyenDungLaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
