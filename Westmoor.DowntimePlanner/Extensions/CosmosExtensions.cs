using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Azure.Cosmos.Linq;

namespace Westmoor.DowntimePlanner.Extensions
{
    public static class CosmosExtensions
    {
        private static readonly Type CosmosLinqQueryType = typeof(CosmosLinqExtensions)
            .Assembly
            .GetType("Microsoft.Azure.Cosmos.Linq.CosmosLinqQuery`1");

        public static bool IsCosmosQuery<T>(this IQueryable<T> source)
        {
            return source.GetType() == CosmosLinqQueryType.MakeGenericType(typeof(T));
        }

        public static async IAsyncEnumerable<T> ToAsyncEnumerable<T>(this IQueryable<T> source)
        {
            if (source.IsCosmosQuery())
            {
                var iterator = source.ToFeedIterator();

                while (iterator.HasMoreResults)
                {
                    foreach(var item in await iterator.ReadNextAsync())
                    {
                        yield return item;
                    }
                }
            }
            else
            {
                foreach (var item in source)
                {
                    yield return item;
                }
            }
        }
    }
}
