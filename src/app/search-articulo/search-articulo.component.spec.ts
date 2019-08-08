import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchArticuloComponent } from './search-articulo.component';

describe('SearchArticuloComponent', () => {
  let component: SearchArticuloComponent;
  let fixture: ComponentFixture<SearchArticuloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchArticuloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
