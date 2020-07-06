using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Westmoor.DowntimePlanner.Security
{
    public class SecurityRequirementsOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // Policy names map to scopes
            Debug.Assert(context.MethodInfo.DeclaringType != null, "context.MethodInfo.DeclaringType != null");
            var requiredScopes = context.MethodInfo.DeclaringType
                .GetCustomAttributes(true)
                .OfType<AuthorizeAttribute>()
                .Concat(
                    context.MethodInfo
                        .GetCustomAttributes(true)
                        .OfType<AuthorizeAttribute>()
                )
                .Select(attr => attr.Policy)
                .Distinct()
                .ToArray();

            if (!requiredScopes.Any())
            {
                return;
            }

            operation.Responses.Add("401", new OpenApiResponse { Description = "Unauthorized" });
            operation.Responses.Add("403", new OpenApiResponse { Description = "Forbidden" });

            var oAuthScheme = new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "apiKey" }
            };

            operation.Security = new List<OpenApiSecurityRequirement>
            {
                new OpenApiSecurityRequirement
                {
                    [ oAuthScheme ] = requiredScopes
                }
            };
        }
    }
}
