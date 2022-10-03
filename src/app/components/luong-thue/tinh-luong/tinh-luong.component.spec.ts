import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinhLuongComponent } from './tinh-luong.component';

describe('TinhLuongComponent', () => {
  let component: TinhLuongComponent;
  let fixture: ComponentFixture<TinhLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TinhLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TinhLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
