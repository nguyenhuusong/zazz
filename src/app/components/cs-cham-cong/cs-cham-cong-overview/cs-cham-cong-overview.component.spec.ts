import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsChamCongOverviewComponent } from './cs-cham-cong-overview.component';

describe('CsChamCongOverviewComponent', () => {
  let component: CsChamCongOverviewComponent;
  let fixture: ComponentFixture<CsChamCongOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsChamCongOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsChamCongOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
