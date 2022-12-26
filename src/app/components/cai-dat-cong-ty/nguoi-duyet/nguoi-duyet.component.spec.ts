import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NguoiDuyetComponent } from './nguoi-duyet.component';

describe('NguoiDuyetComponent', () => {
  let component: NguoiDuyetComponent;
  let fixture: ComponentFixture<NguoiDuyetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NguoiDuyetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NguoiDuyetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
