import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinhSachLuongComponent } from './chinh-sach-luong.component';

describe('ChinhSachLuongComponent', () => {
  let component: ChinhSachLuongComponent;
  let fixture: ComponentFixture<ChinhSachLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChinhSachLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChinhSachLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
