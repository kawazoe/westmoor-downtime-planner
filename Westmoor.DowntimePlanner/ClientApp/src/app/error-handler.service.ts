import { ErrorHandler, Injectable } from '@angular/core';
import { AnalyticsService } from './services/business/analytics.service';
import { SeverityLevel } from '@microsoft/applicationinsights-common';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  constructor(
    private analytics: AnalyticsService
  ) {
  }

  handleError(error: any): void {
    console.error(error);
    this.analytics.trackException({
      exception: error,
      severityLevel: SeverityLevel.Error
    });
  }
}
