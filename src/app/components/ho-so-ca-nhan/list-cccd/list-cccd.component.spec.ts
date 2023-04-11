import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCccdComponent } from './list-cccd.component';

describe('ListCccdComponent', () => {
  let component: ListCccdComponent;
  let fixture: ComponentFixture<ListCccdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCccdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCccdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
