import { Injectable } from '@angular/core';
import {
  ApplicationInsights,
  DistributedTracingModes,
  IDependencyTelemetry,
  IEventTelemetry,
  IExceptionTelemetry,
  IPageViewTelemetry,
  ITraceTelemetry,
  Util,
  SeverityLevel
} from '@microsoft/applicationinsights-web';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private appInsights: ApplicationInsights;

  constructor() {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: environment.analytics.instrumentationKey,
        distributedTracingMode: DistributedTracingModes.W3C
      }
    });
    this.appInsights.loadAppInsights();
  }

  public setUserContext(userId: string) {
    this.appInsights.setAuthenticatedUserContext(userId);
  }

  public clearUserContext() {
    this.appInsights.clearAuthenticatedUserContext();
  }

  public trackDependencyData(dependency: Omit<IDependencyTelemetry, 'id'>) {
    this.appInsights.trackDependencyData({
      ...dependency,
      id: Util.newId(),
      properties: {
        ...dependency.properties,
        ...environment.analytics.globalCustomProperties
      }
    });
  }

  public trackPageView(pageView: IPageViewTelemetry) {
    this.appInsights.trackPageView({
      ...pageView,
      properties: {
        ...pageView.properties,
        ...environment.analytics.globalCustomProperties
      }
    });
  }

  public trackEvent(event: IEventTelemetry) {
    this.appInsights.trackEvent({
      ...event,
      properties: {
        ...event.properties,
        ...environment.analytics.globalCustomProperties
      }
    });
  }

  public trackException(exception: Omit<IExceptionTelemetry, 'id'>) {
    this.appInsights.trackException({
      ...exception,
      id: Util.newId(),
      properties: {
        ...exception.properties,
        ...environment.analytics.globalCustomProperties
      }
    });
  }

  public trackTrace(trace: ITraceTelemetry) {
    function getLogger() {
      switch (trace.severityLevel) {
        case SeverityLevel.Verbose:
          return 'log';
        case SeverityLevel.Information:
          return 'info';
        case SeverityLevel.Warning:
          return 'warn';
        case SeverityLevel.Error:
        case SeverityLevel.Critical:
          return 'error';
        default:
          return 'log';
      }
    }

    const logger = console[getLogger()];

    if (trace.properties) {
      logger('[AnalyticsService]', trace.message, trace.properties);
    } else {
      logger('[AnalyticsService]', trace.message);
    }

    this.appInsights.trackTrace({
      ...trace,
      properties: {
        ...trace.properties,
        ...environment.analytics.globalCustomProperties
      }
    });
  }
}
