import { TestBed } from '@angular/core/testing';

import { ChitService } from './chit.service';

describe('ChitService', () => {
  let service: ChitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
