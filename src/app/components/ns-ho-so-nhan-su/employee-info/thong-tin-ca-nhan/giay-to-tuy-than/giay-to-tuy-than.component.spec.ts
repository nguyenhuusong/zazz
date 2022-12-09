import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiayToTuyThanComponent } from './giay-to-tuy-than.component';

describe('GiayToTuyThanComponent', () => {
  let component: GiayToTuyThanComponent;
  let fixture: ComponentFixture<GiayToTuyThanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiayToTuyThanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiayToTuyThanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
