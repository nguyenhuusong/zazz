import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChucDanhComponent } from './chuc-danh.component';

describe('ChucDanhComponent', () => {
  let component: ChucDanhComponent;
  let fixture: ComponentFixture<ChucDanhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChucDanhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChucDanhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
