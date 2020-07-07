using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;

namespace Westmoor.DowntimePlanner.Extensions
{
    public static class CosmosExtensions
    {
        private static readonly Lazy<Type> CosmosLinqQueryType = new Lazy<Type>(() => Assembly
            .GetAssembly(typeof(CosmosLinqExtensions))
            ?.GetTypes()
            .First(t => t.Name == "CosmosLinqQuery")
        );

        public static bool IsCosmosQuery<T>(this IQueryable<T> source)
        {
            return source.GetType() == CosmosLinqQueryType.Value;
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
