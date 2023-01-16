import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTerminateComponent } from './detail-terminate.component';

describe('DetailTerminateComponent', () => {
  let component: DetailTerminateComponent;
  let fixture: ComponentFixture<DetailTerminateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailTerminateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTerminateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
