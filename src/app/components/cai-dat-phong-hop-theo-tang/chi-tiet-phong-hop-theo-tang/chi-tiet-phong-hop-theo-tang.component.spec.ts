import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietPhongHopTheoTangComponent } from './chi-tiet-phong-hop-theo-tang.component';

describe('ChiTietPhongHopTheoTangComponent', () => {
  let component: ChiTietPhongHopTheoTangComponent;
  let fixture: ComponentFixture<ChiTietPhongHopTheoTangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietPhongHopTheoTangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietPhongHopTheoTangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
