import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhepBuComponent } from './phep-bu.component';

describe('PhepBuComponent', () => {
  let component: PhepBuComponent;
  let fixture: ComponentFixture<PhepBuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhepBuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhepBuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
