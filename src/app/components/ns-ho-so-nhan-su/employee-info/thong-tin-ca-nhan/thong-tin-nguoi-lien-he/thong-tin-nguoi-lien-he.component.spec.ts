import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinNguoiLienHeComponent } from './thong-tin-nguoi-lien-he.component';

describe('ThongTinNguoiLienHeComponent', () => {
  let component: ThongTinNguoiLienHeComponent;
  let fixture: ComponentFixture<ThongTinNguoiLienHeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinNguoiLienHeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinNguoiLienHeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
