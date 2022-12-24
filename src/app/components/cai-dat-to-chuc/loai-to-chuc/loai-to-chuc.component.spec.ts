import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaiToChucComponent } from './loai-to-chuc.component';

describe('LoaiToChucComponent', () => {
  let component: LoaiToChucComponent;
  let fixture: ComponentFixture<LoaiToChucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaiToChucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaiToChucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
