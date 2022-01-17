import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietPhongHopComponent } from './chi-tiet-phong-hop.component';

describe('ChiTietPhongHopComponent', () => {
  let component: ChiTietPhongHopComponent;
  let fixture: ComponentFixture<ChiTietPhongHopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietPhongHopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietPhongHopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
