import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaiDatPhongHopTheoTangComponent } from './cai-dat-phong-hop-theo-tang.component';

describe('CaiDatPhongHopTheoTangComponent', () => {
  let component: CaiDatPhongHopTheoTangComponent;
  let fixture: ComponentFixture<CaiDatPhongHopTheoTangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaiDatPhongHopTheoTangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaiDatPhongHopTheoTangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
