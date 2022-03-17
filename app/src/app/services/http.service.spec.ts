import { TestBed } from '@angular/core/testing';

import { HttpService } from './http.service';
import { AppModule } from 'src/app/app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('HttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AppModule
    ],
    providers: [
      { provide: APP_BASE_HREF, useValue : '/' }
    ]
  }));

  it('should be created', () => {
    const service: HttpService = TestBed.get(HttpService);
    expect(service).toBeTruthy();
  });
});
