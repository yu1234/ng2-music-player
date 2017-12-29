import { TestBed, inject } from '@angular/core/testing';

import { HttpRequest.ServiceService } from './http-request.service.service';

describe('HttpRequest.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpRequest.ServiceService]
    });
  });

  it('should be created', inject([HttpRequest.ServiceService], (service: HttpRequest.ServiceService) => {
    expect(service).toBeTruthy();
  }));
});
