import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaiBieuMauComponent } from './loai-bieu-mau.component';

describe('LoaiBieuMauComponent', () => {
  let component: LoaiBieuMauComponent;
  let fixture: ComponentFixture<LoaiBieuMauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaiBieuMauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaiBieuMauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
