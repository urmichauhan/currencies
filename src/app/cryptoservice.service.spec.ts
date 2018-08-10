import { TestBed, inject } from '@angular/core/testing';

import { CryptoserviceService } from './cryptoservice.service';

describe('CryptoserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CryptoserviceService]
    });
  });

  it('should be created', inject([CryptoserviceService], (service: CryptoserviceService) => {
    expect(service).toBeTruthy();
  }));
});
