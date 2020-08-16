using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Westmoor.DowntimePlanner.Security
{
    public interface ITokenStore
    {
        Task<TResult> WithTokenAsync<TResult>(
            Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> sendAsync,
            Func<OAuthToken, Task<TResult>> func
        );
        Task WithTokenAsync(
            Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> sendAsync,
            Func<OAuthToken, Task> func
        );
    }
}
