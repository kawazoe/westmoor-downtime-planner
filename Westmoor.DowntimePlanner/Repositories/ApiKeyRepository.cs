using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Entities;
using Westmoor.DowntimePlanner.Requests;

namespace Westmoor.DowntimePlanner.Repositories
{
    public class ApiKeyRepository : IApiKeyRepository
    {
        private readonly List<ApiKeyEntity> _data = new List<ApiKeyEntity>
        {
            new ApiKeyEntity
            {
                Key = "dev",
                Owner = "Test User",
                Roles = new [] { Roles.Admin },
                CreatedOn = DateTimeOffset.UtcNow
            },
        };

        public async Task<ApiKeyEntity[]> GetAllAsync()
        {
            return _data.ToArray();
        }

        public async Task<ApiKeyEntity> GetByKeyAsync(string key)
        {
            return _data.FirstOrDefault(e => e.Key == key);
        }

        public async Task CreateAsync(CreateApiKeyRequest request)
        {
            _data.Add(new ApiKeyEntity
            {
                Key = Guid.NewGuid().ToString(),
                Owner = request.Owner,
                Roles = request.Roles,
                CreatedOn = DateTimeOffset.UnixEpoch
            });
        }

        public async Task UpdateAsync(string key, UpdateApiKeyRequest request)
        {
            var entity = _data.First(e => e.Key == key);

            _data.Add(new ApiKeyEntity
            {
                Key = entity.Key,
                Owner = request.Owner ?? entity.Owner,
                Roles = request.Roles ?? entity.Roles,
                CreatedOn = entity.CreatedOn
            });
        }

        public async Task DeleteAsync(string key)
        {
            var entity = _data.First(e => e.Key == key);

            _data.Remove(entity);
        }
    }
}
