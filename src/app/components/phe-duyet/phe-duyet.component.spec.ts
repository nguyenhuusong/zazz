import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PheDuyetComponent } from './phe-duyet.component';

describe('PheDuyetComponent', () => {
  let component: PheDuyetComponent;
  let fixture: ComponentFixture<PheDuyetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PheDuyetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PheDuyetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
