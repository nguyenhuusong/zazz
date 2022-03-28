import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietPheDuyetComponent } from './chi-tiet-phe-duyet.component';

describe('ChiTietPheDuyetComponent', () => {
  let component: ChiTietPheDuyetComponent;
  let fixture: ComponentFixture<ChiTietPheDuyetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietPheDuyetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietPheDuyetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
