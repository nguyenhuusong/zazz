import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhLuongComponent } from './quyet-dinh-luong.component';

describe('QuyetDinhLuongComponent', () => {
  let component: QuyetDinhLuongComponent;
  let fixture: ComponentFixture<QuyetDinhLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
