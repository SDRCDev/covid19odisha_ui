import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingSideMenuComponent } from './landing-side-menu.component';

describe('LandingSideMenuComponent', () => {
  let component: LandingSideMenuComponent;
  let fixture: ComponentFixture<LandingSideMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingSideMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
