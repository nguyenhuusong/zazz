import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChuyenMonComponent } from './edit-chuyen-mon.component';

describe('EditChuyenMonComponent', () => {
  let component: EditChuyenMonComponent;
  let fixture: ComponentFixture<EditChuyenMonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditChuyenMonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChuyenMonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
