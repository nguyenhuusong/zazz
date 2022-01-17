import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLoaiThongBaoComponent } from './page-loai-thong-bao.component';

describe('PageLoaiThongBaoComponent', () => {
  let component: PageLoaiThongBaoComponent;
  let fixture: ComponentFixture<PageLoaiThongBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageLoaiThongBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLoaiThongBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
