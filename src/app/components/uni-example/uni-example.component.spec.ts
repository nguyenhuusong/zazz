import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniExampleComponent } from './uni-example.component';

describe('UniExampleComponent', () => {
  let component: UniExampleComponent;
  let fixture: ComponentFixture<UniExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
