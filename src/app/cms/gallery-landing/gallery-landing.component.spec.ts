import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryLandingComponent } from './gallery-landing.component';

describe('GalleryLandingComponent', () => {
  let component: GalleryLandingComponent;
  let fixture: ComponentFixture<GalleryLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
