import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { api_url } from './core/injectable_tokens/api_url';
import { errorsInterceptor } from './core/interceptors/errors/errors.interceptor';
import { headersInterceptor } from './core/interceptors/headers/headers.interceptor';
import { loadingInterceptor } from './core/interceptors/loading/loading.interceptor';
import { provideLottieOptions } from 'ngx-lottie';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        headersInterceptor,
        errorsInterceptor,
        loadingInterceptor,
      ])
    ),
    provideAnimations(),
    provideToastr(),
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
    importProvidersFrom(NgxSpinnerModule, CookieService),
    {
      provide: api_url,
      useValue: 'https://ecommerce.routemisr.com/api/v1',
    },
  ],
};
