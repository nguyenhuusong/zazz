import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PqTheNhanVienComponent } from './pq-the-nhan-vien.component';

describe('PqTheNhanVienComponent', () => {
  let component: PqTheNhanVienComponent;
  let fixture: ComponentFixture<PqTheNhanVienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PqTheNhanVienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PqTheNhanVienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
