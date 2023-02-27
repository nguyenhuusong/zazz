import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoTroComponent } from './ho-tro.component';

describe('HoTroComponent', () => {
  let component: HoTroComponent;
  let fixture: ComponentFixture<HoTroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoTroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoTroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
