using System.Linq;
using System.Net.Http;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;

namespace Westmoor.DowntimePlanner
{
    public class CosmosTelemetryInitializer : ITelemetryInitializer
    {
        public void Initialize(ITelemetry telemetry)
        {
            if (!(telemetry is DependencyTelemetry dependency))
            {
                return;
            }

            if (dependency.Type != "Azure DocumentDB")
            {
                return;
            }

            if (!dependency.Context.TryGetRawObject("HttpResponse", out var rawResponse))
            {
                return;
            }

            var httpResponse = (HttpResponseMessage) rawResponse;

            if (!httpResponse.Headers.TryGetValues("x-ms-request-charge", out var charges))
            {
                return;
            }

            var charge = charges.Single();

            dependency.Metrics.Add("Azure.DocumentDB|Request Charge", double.Parse(charge));
        }
    }
}
