import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViTriCongViecComponent } from './vi-tri-cong-viec.component';

describe('ViTriCongViecComponent', () => {
  let component: ViTriCongViecComponent;
  let fixture: ComponentFixture<ViTriCongViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViTriCongViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViTriCongViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
