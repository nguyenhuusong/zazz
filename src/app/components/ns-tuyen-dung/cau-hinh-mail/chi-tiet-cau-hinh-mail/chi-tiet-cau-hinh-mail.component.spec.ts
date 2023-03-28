import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietCauHinhMailComponent } from './chi-tiet-cau-hinh-mail.component';

describe('ChiTietCauHinhMailComponent', () => {
  let component: ChiTietCauHinhMailComponent;
  let fixture: ComponentFixture<ChiTietCauHinhMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietCauHinhMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietCauHinhMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
