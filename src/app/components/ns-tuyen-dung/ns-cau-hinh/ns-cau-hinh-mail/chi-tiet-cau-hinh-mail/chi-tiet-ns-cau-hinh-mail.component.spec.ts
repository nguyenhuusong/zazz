import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsChiTietCauHinhMailComponent } from './chi-tiet-ns-cau-hinh-mail.component';

describe('NsChiTietCauHinhMailComponent', () => {
  let component: NsChiTietCauHinhMailComponent;
  let fixture: ComponentFixture<NsChiTietCauHinhMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NsChiTietCauHinhMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NsChiTietCauHinhMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
