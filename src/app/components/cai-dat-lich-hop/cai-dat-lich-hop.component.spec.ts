import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaiDatLichHopComponent } from './cai-dat-lich-hop.component';

describe('CaiDatLichHopComponent', () => {
  let component: CaiDatLichHopComponent;
  let fixture: ComponentFixture<CaiDatLichHopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaiDatLichHopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaiDatLichHopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
