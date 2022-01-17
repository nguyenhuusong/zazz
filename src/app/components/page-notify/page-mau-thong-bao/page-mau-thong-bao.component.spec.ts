import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMauThongBaoComponent } from './page-mau-thong-bao.component';

describe('PageMauThongBaoComponent', () => {
  let component: PageMauThongBaoComponent;
  let fixture: ComponentFixture<PageMauThongBaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageMauThongBaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageMauThongBaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
