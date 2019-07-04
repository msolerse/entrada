import { TestBed } from '@angular/core/testing';

import { Tabla2Service } from './tabla2.service';

describe('Tabla2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Tabla2Service = TestBed.get(Tabla2Service);
    expect(service).toBeTruthy();
  });
});
