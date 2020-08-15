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
                    .Select(mapping => (
                        mapping.sourceClaimType,
                        mapping.targetClaimType,
                        headerValue: ctx.Request.Headers
                            .FirstOrDefault(h =>
                                h.Key.Equals(mapping.headerKey, StringComparison.OrdinalIgnoreCase)
                            )
                            .Value
                            .First()
                    ))
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
