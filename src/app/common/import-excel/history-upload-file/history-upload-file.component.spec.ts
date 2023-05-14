import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryUploadFileComponent } from './history-upload-file.component';

describe('HistoryUploadFileComponent', () => {
  let component: HistoryUploadFileComponent;
  let fixture: ComponentFixture<HistoryUploadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryUploadFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
