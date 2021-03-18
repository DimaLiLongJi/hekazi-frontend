import { Injectable, InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentServiceService {
  public environment: boolean = environment.production;
  public basePrefix: string = environment.production ? '/manager' : '/manager';
}

export const API_URL = new InjectionToken<string>('api_url', {
  providedIn: 'root',
  factory: () => (environment.production ? '/manager' : '/manager')
});

export const STATIC_API_URL = new InjectionToken<string>('static_api_url', {
  providedIn: 'root',
  factory: () => (environment.production ? '/manager/stataic/' : '/manager/static/')
});
