import { TestBed } from '@angular/core/testing';

import { TestResolverService } from './test-resolver.service';

describe('TestResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestResolverService = TestBed.get(TestResolverService);
    expect(service).toBeTruthy();
  });
});
