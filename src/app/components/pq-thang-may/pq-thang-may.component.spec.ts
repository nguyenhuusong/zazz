import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PqThangMayComponent } from './pq-thang-may.component';

describe('PqThangMayComponent', () => {
  let component: PqThangMayComponent;
  let fixture: ComponentFixture<PqThangMayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PqThangMayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PqThangMayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
