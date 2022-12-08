import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditViTriCongViecComponent } from './edit-vi-tri-cong-viec.component';

describe('EditViTriCongViecComponent', () => {
  let component: EditViTriCongViecComponent;
  let fixture: ComponentFixture<EditViTriCongViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditViTriCongViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditViTriCongViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
