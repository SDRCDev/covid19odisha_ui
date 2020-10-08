import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantLinksUploadComponent } from './important-links-upload.component';

describe('ImportantLinksUploadComponent', () => {
  let component: ImportantLinksUploadComponent;
  let fixture: ComponentFixture<ImportantLinksUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportantLinksUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportantLinksUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
