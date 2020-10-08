import { TestBed } from '@angular/core/testing';

import { LandingServiceService } from './landing-service.service';

describe('LandingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LandingServiceService = TestBed.get(LandingServiceService);
    expect(service).toBeTruthy();
  });
});
