import { TestBed } from '@angular/core/testing';

import { SeleccionService } from './seleccion.service';

describe('SeleccionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SeleccionService = TestBed.get(SeleccionService);
    expect(service).toBeTruthy();
  });
});
