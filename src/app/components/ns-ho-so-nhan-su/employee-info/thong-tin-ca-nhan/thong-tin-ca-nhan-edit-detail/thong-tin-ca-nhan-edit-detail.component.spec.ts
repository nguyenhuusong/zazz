import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinCaNhanEditDetailComponent } from './thong-tin-ca-nhan-edit-detail.component';

describe('ThongTinCaNhanEditDetailComponent', () => {
  let component: ThongTinCaNhanEditDetailComponent;
  let fixture: ComponentFixture<ThongTinCaNhanEditDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinCaNhanEditDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinCaNhanEditDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
