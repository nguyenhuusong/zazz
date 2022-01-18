import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoiLamViecComponent } from './noi-lam-viec.component';

describe('NoiLamViecComponent', () => {
  let component: NoiLamViecComponent;
  let fixture: ComponentFixture<NoiLamViecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoiLamViecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoiLamViecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
