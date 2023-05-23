import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabCandidateFinalComponent } from './tab-candidate-final.component';

describe('TabCandidateFinalComponent', () => {
  let component: TabCandidateFinalComponent;
  let fixture: ComponentFixture<TabCandidateFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabCandidateFinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabCandidateFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
