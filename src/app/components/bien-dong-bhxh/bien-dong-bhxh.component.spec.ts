import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienDongBHXHComponent } from './bien-dong-bhxh.component';

describe('BienDongBHXHComponent', () => {
  let component: BienDongBHXHComponent;
  let fixture: ComponentFixture<BienDongBHXHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienDongBHXHComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BienDongBHXHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
