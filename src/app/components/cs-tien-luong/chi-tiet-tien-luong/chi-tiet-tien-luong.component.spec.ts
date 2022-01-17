import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietTienLuongComponent } from './chi-tiet-tien-luong.component';

describe('ChiTietTienLuongComponent', () => {
  let component: ChiTietTienLuongComponent;
  let fixture: ComponentFixture<ChiTietTienLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietTienLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietTienLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
