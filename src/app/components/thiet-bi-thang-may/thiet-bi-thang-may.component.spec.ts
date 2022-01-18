import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThietBiThangMayComponent } from './thiet-bi-thang-may.component';

describe('ThietBiThangMayComponent', () => {
  let component: ThietBiThangMayComponent;
  let fixture: ComponentFixture<ThietBiThangMayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThietBiThangMayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThietBiThangMayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
