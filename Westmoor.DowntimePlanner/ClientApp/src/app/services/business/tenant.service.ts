import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  readonly current = new ReplaySubject<string | null>(1);
}
