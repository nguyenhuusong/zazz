import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietCsLoiChamCongComponent } from './chi-tiet-cs-loi-cham-cong.component';

describe('ChiTietCsLoiChamCongComponent', () => {
  let component: ChiTietCsLoiChamCongComponent;
  let fixture: ComponentFixture<ChiTietCsLoiChamCongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietCsLoiChamCongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietCsLoiChamCongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
