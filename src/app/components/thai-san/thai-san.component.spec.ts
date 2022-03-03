import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThaiSanComponent } from './thai-san.component';

describe('ThaiSanComponent', () => {
  let component: ThaiSanComponent;
  let fixture: ComponentFixture<ThaiSanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThaiSanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThaiSanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
