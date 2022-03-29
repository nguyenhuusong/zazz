import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhepNamComponent } from './phep-nam.component';

describe('PhepNamComponent', () => {
  let component: PhepNamComponent;
  let fixture: ComponentFixture<PhepNamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhepNamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhepNamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
