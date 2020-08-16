using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Westmoor.DowntimePlanner.Security;

namespace Westmoor.DowntimePlanner.Extensions
{
    public static class HttpClientExtensions
    {
        public static HttpRequestMessage WithBearerToken(this HttpRequestMessage message, OAuthToken token)
        {
            message.Headers.Authorization = new AuthenticationHeaderValue(
                token.TokenType,
                token.AccessToken
            );

            return message;
        }

        public static HttpRequestMessage WithJsonContent(this HttpRequestMessage message, string payload)
        {
            message.Content = new StringContent(payload, Encoding.UTF8, "application/json");

            return message;
        }
    }
}
