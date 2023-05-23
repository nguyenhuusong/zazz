import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabCandidateInterviewComponent } from './tab-candidate-interview.component';

describe('TabCandidateInterviewComponent', () => {
  let component: TabCandidateInterviewComponent;
  let fixture: ComponentFixture<TabCandidateInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabCandidateInterviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabCandidateInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
