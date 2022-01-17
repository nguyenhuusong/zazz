import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectCardComponent } from './detect-card.component';

describe('DetectCardComponent', () => {
  let component: DetectCardComponent;
  let fixture: ComponentFixture<DetectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetectCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
