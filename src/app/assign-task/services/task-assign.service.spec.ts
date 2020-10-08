import { TestBed } from '@angular/core/testing';

import { TaskAssignService } from './task-assign.service';

describe('TaskAssignService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskAssignService = TestBed.get(TaskAssignService);
    expect(service).toBeTruthy();
  });
});
