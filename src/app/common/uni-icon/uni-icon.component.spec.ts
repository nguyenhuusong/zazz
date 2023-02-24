import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UniIconComponent } from './uni-icon.component';

describe('UniIconComponent', () => {
  let component: UniIconComponent;
  let fixture: ComponentFixture<UniIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
