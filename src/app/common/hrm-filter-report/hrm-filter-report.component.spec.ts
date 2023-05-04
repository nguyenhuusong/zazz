import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HrmFilterReportComponent } from './hrm-filter-report.component';

describe('HrmFilterReportComponent', () => {
  let component: HrmFilterReportComponent;
  let fixture: ComponentFixture<HrmFilterReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrmFilterReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrmFilterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
