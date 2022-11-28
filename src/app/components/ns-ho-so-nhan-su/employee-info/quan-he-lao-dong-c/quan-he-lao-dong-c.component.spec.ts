import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanHeLaoDongCComponent } from './quan-he-lao-dong-c.component';

describe('QuanHeLaoDongCComponent', () => {
  let component: QuanHeLaoDongCComponent;
  let fixture: ComponentFixture<QuanHeLaoDongCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanHeLaoDongCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuanHeLaoDongCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
