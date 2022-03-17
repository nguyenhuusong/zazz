import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThamSoChungListComponent } from './tham-so-chung-list.component';

describe('ThamSoChungListComponent', () => {
  let component: ThamSoChungListComponent;
  let fixture: ComponentFixture<ThamSoChungListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThamSoChungListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThamSoChungListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
