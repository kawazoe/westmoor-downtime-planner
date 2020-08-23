using System.Collections.Generic;
using System.Linq;

namespace Westmoor.DowntimePlanner.Extensions
{
    public static class EnumerableExtensions
    {
        /// <summary>
        /// Race a source enumerable against a set candidates. The first one to yield
        /// a value will win the race and get to yield all of its values. Other
        /// candidates are ignored. Candidates are raced in order that they were provided.
        /// </summary>
        /// <param name="source"></param>
        /// <param name="candidates"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static IEnumerable<T> Race<T>(this IEnumerable<T> source, params IEnumerable<T>[] candidates)
        {
            var didYield = false;
            foreach (var candidate in candidates.Prepend(source))
            {
                foreach (var value in candidate)
                {
                    didYield = true;
                    yield return value;
                }

                if (didYield)
                {
                    yield break;
                }
            }
        }

        /// <summary>
        /// Prepend the first enumerable to the second.
        /// </summary>
        /// <param name="second"></param>
        /// <param name="first"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static IEnumerable<T> ConcatRight<T>(this IEnumerable<T> second, IEnumerable<T> first)
        {
            return first.Concat(second);
        }
    }
}
