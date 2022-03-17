import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThamSoChungDetailComponent } from './tham-so-chung-detail.component';

describe('ThamSoChungDetailComponent', () => {
  let component: ThamSoChungDetailComponent;
  let fixture: ComponentFixture<ThamSoChungDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThamSoChungDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThamSoChungDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
