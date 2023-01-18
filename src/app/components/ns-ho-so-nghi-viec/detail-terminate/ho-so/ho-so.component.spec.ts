import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoSoComponent } from './ho-so.component';

describe('HoSoComponent', () => {
  let component: HoSoComponent;
  let fixture: ComponentFixture<HoSoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoSoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
