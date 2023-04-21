import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileFormDataComponent } from './upload-file-form-data.component';

describe('UploadFileFormDataComponent', () => {
  let component: UploadFileFormDataComponent;
  let fixture: ComponentFixture<UploadFileFormDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFileFormDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileFormDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
