import { Component } from '@angular/core';
import { Alert, AlertService } from './alert.service';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
})
export class AlertBoxComponent {
  alerts$ = this.alertService.alerts$;

  constructor(private alertService: AlertService) {
  }

  public dismiss(alert: Alert) {
    this.alertService.dismiss(alert);
  }
}
