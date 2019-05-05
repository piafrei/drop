import { TestBed } from '@angular/core/testing';

import { DropService } from './drop.service';

describe('DropService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DropService = TestBed.get(DropService);
    expect(service).toBeTruthy();
  });
});
