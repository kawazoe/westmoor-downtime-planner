import { TestBed } from '@angular/core/testing';

import { ApiKeyAuthHttpInterceptorService } from './api-key-auth-http-interceptor.service';

describe('ApiKeyAuthHttpInterceptorService', () => {
  let service: ApiKeyAuthHttpInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiKeyAuthHttpInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
