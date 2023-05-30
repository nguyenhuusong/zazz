import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieuChinhComponent } from './dieu-chinh.component';

describe('DieuChinhComponent', () => {
  let component: DieuChinhComponent;
  let fixture: ComponentFixture<DieuChinhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DieuChinhComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieuChinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
