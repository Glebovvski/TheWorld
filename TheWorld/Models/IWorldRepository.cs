using System.Collections.Generic;
using System.Threading.Tasks;

namespace TheWorld.Models
{
    public interface IWorldRepository
    {
        IEnumerable<Trip> GetAllTrips();
        Trip GetTripByName(string tripName);
        void AddTrip(Trip trip);
        Task<bool> SaveChangesAsync();
        void AddStop(string tripName, Stop newStop, string username);
        IEnumerable<Trip> GetTripsByUsername(string name);
        Trip GetUserTripByName(string tripName, string name);
    }
}