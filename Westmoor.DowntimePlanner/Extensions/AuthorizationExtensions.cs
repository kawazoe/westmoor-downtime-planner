using System;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using Westmoor.DowntimePlanner.Entities;

namespace Westmoor.DowntimePlanner.Extensions
{
    public static class AuthorizationExtensions
    {
        private const string ClaimsNamespace = "https://westmoor.rpg/";

        public static Expression<Func<T, bool>> GetMyContentPredicate<T>(this ClaimsPrincipal user) where T : CosmosEntity
        {
            var ownershipId = user.Claims
                .First(c => c.Type == $"{ClaimsNamespace}ownership_id")
                .Value;
            var campaigns = user.Claims
                .Where(c => c.Type == $"{ClaimsNamespace}campaigns")
                .Select(c => c.Value);

            var identities = campaigns
                .Prepend(ownershipId)
                .ToArray();

            return e => e.SharedWith.Any(id => identities.Contains(id));
        }
    }
}
