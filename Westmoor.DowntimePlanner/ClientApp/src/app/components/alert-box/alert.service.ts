import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  type: 'success' | 'info' | 'warning' | 'danger';
  message: string;
  timeout?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private _alerts = new BehaviorSubject<Alert[]>([]);

  public alerts$ = this._alerts.asObservable();

  public push(alert: Alert) {
    this._alerts.next([...this._alerts.getValue(), alert]);
  }

  public dismiss(alert: Alert) {
    this._alerts.next(this._alerts.getValue().filter(a => a !== alert));
  }
}
