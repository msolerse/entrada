import { TestBed } from '@angular/core/testing';

import { SearchArticuloService } from './search-articulo.service';

describe('SearchArticuloService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchArticuloService = TestBed.get(SearchArticuloService);
    expect(service).toBeTruthy();
  });
});
