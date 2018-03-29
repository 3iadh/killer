import { TestBed, inject } from '@angular/core/testing';

import { KillerDataService } from './killer-data.service';

describe('KillerDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KillerDataService]
    });
  });

  it('should be created', inject([KillerDataService], (service: KillerDataService) => {
    expect(service).toBeTruthy();
  }));
});
