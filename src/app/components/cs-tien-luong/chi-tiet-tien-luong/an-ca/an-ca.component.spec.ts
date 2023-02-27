import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnCaComponent } from './an-ca.component';

describe('AnCaComponent', () => {
  let component: AnCaComponent;
  let fixture: ComponentFixture<AnCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnCaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
