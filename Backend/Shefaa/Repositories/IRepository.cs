
namespace Shefaa.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<int> CommitChangesAsync();

        Task<EntityEntry<T>> AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>>? filter = null, Expression<Func<T, object>>[]? includes = null, bool trackChanges = false);
        Task<T?> GetOneAsynch(Expression<Func<T, bool>>? filter = null, Expression<Func<T, object>>[]? includes = null, bool trackChanges = false);
        Task<bool> ExistsAsync(Expression<Func<T, bool>>? filter = null);
    }
}
