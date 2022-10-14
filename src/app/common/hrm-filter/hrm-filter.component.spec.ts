import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HrmFilterCrumbComponent } from './hrm-filter.component';

describe('HrmFilterCrumbComponent', () => {
  let component: HrmFilterCrumbComponent;
  let fixture: ComponentFixture<HrmFilterCrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrmFilterCrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrmFilterCrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
