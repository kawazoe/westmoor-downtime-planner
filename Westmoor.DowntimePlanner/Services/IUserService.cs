using System.Threading.Tasks;
using Westmoor.DowntimePlanner.Responses;

namespace Westmoor.DowntimePlanner.Services
{
    public interface IUserService
    {
        Task<UserResponse[]> SearchByEmailAsync(string email);
    }
}