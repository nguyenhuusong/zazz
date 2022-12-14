import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HrmSearchEmpComponent } from './hrm-search-emp.component';

describe('HrmSearchEmpComponent', () => {
  let component: HrmSearchEmpComponent;
  let fixture: ComponentFixture<HrmSearchEmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrmSearchEmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrmSearchEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
