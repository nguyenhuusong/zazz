import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinhSachNvComponent } from './chinh-sach-nv.component';

describe('ChinhSachNvComponent', () => {
  let component: ChinhSachNvComponent;
  let fixture: ComponentFixture<ChinhSachNvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChinhSachNvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChinhSachNvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
