using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Westmoor.DowntimePlanner.Security
{
    public static class SecureHeadersIdentityFactory
    {
        public static Func<TokenValidatedContext, Task> CreateValidator(
            IEnumerable<(string headerKey, string sourceClaimType, string targetClaimType)> mappings
        )
        {
            return ctx =>
            {
                var validatedClaims = mappings
                    .SelectMany(mapping => ctx.Request.Headers
                        .Where(h => h.Key.Equals(mapping.headerKey, StringComparison.OrdinalIgnoreCase))
                        .SelectMany(header => header.Value
                            // Since ASP.NET Core does not split custom headers on comas, we must do it by hand
                            .SelectMany(headerValue => headerValue.Split(','))
                            .Select(headerValue => (
                                mapping.sourceClaimType,
                                mapping.targetClaimType,
                                headerValue
                            ))
                        )
                    )
                    .Where(mapping => ctx.Principal.Claims
                        .Any(c =>
                            c.Type == mapping.sourceClaimType &&
                            c.Value == mapping.headerValue
                        )
                    )
                    .Select(mapping => new Claim(mapping.targetClaimType, mapping.headerValue));

                ctx.Principal.AddIdentity(new ClaimsIdentity(validatedClaims, "SecureHeaders"));

                return Task.CompletedTask;
            };
        }
    }
}
