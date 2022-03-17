import { TestBed } from '@angular/core/testing';

import { SnackService } from './snack.service';
import { AppModule } from 'src/app/app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('SnackService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AppModule
    ],
    providers: [
      { provide: APP_BASE_HREF, useValue : '/' }
    ]
  }));

  it('should be created', () => {
    const service: SnackService = TestBed.get(SnackService);
    expect(service).toBeTruthy();
  });
});
