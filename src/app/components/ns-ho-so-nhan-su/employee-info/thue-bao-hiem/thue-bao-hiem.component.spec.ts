import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThueBaoHiemComponent } from './thue-bao-hiem.component';

describe('ThueBaoHiemComponent', () => {
  let component: ThueBaoHiemComponent;
  let fixture: ComponentFixture<ThueBaoHiemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThueBaoHiemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThueBaoHiemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
