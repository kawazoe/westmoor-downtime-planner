using System;

namespace Westmoor.DowntimePlanner.Extensions
{
    public static class ObjectExtensions
    {
        public static TResult Map<T, TResult>(this T value, Func<T, TResult> selector) =>
            selector.Invoke(value);

        public static TResult MapOrDefault<T, TResult>(this T value, Func<T, TResult> selector, TResult defaultValue = default) =>
            Equals(value, default(T))
                ? defaultValue
                : selector.Invoke(value);

        public static T With<T>(this T value, Action<T> mutator)
        {
            mutator.Invoke(value);
            return value;
        }
    }
}
