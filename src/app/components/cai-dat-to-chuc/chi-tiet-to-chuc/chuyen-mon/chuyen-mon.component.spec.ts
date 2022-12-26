import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChuyenMonComponent } from './chuyen-mon.component';

describe('ChuyenMonComponent', () => {
  let component: ChuyenMonComponent;
  let fixture: ComponentFixture<ChuyenMonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChuyenMonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChuyenMonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
