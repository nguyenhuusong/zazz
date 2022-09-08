import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabThanhPhanLuongComponent } from './tab-thanh-phan-luong.component';

describe('TabThanhPhanLuongComponent', () => {
  let component: TabThanhPhanLuongComponent;
  let fixture: ComponentFixture<TabThanhPhanLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabThanhPhanLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabThanhPhanLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
