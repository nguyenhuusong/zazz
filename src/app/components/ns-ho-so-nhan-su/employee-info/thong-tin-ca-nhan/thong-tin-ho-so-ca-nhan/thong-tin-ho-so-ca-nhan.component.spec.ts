import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinHoSoCaNhanComponent } from './thong-tin-ho-so-ca-nhan.component';

describe('ThongTinHoSoCaNhanComponent', () => {
  let component: ThongTinHoSoCaNhanComponent;
  let fixture: ComponentFixture<ThongTinHoSoCaNhanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinHoSoCaNhanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinHoSoCaNhanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
