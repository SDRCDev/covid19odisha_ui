import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUserfulLinkComponent } from './home-userful-link.component';

describe('HomeUserfulLinkComponent', () => {
  let component: HomeUserfulLinkComponent;
  let fixture: ComponentFixture<HomeUserfulLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeUserfulLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeUserfulLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
