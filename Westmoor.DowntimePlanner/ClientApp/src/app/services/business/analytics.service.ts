import { Injectable } from '@angular/core';
import {
  ApplicationInsights,
  DistributedTracingModes,
  IDependencyTelemetry,
  IEventTelemetry,
  IExceptionTelemetry,
  IPageViewTelemetry,
  Util
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
}
