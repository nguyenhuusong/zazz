import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanhPhanLuongComponent } from './thanh-phan-luong.component';

describe('ThanhPhanLuongComponent', () => {
  let component: ThanhPhanLuongComponent;
  let fixture: ComponentFixture<ThanhPhanLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThanhPhanLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThanhPhanLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
