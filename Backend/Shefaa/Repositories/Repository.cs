
namespace Shefaa.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected ApplicationDbContext context;
        DbSet<T> set;
        private readonly ILogger<Repository<T>> _logger;

        public Repository(ApplicationDbContext context, ILogger<Repository<T>> logger)
        {
            this.context = context;
            set = context.Set<T>();
            _logger = logger;
        }

        public async Task<int> CommitChangesAsync()
        {
            try
            {
                return await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log with full stack trace (Exception overload) so the cause is visible
                // in whatever sink is configured (console in dev, structured logs in prod).
                _logger.LogError(
                    ex,
                    "Database error in Repository<{EntityType}>.CommitChangesAsync() — " +
                    "{ExceptionType}: {ExceptionMessage}",
                    typeof(T).Name,
                    ex.GetType().Name,
                    ex.Message);

                // Rethrow: silent return-0 is dangerous in a healthcare app.
                // The global exception handler in Program.cs will return a well-formed
                // ApiResponse<object> 500 to the client. No data-loss goes unnoticed.
                throw;
            }
        }

        public async Task<EntityEntry<T>> AddAsync(T entity)
        {
            return await set.AddAsync(entity);
        }

        public void Update(T entity)
        {
            set.Update(entity);
        }
        public void Delete(T entity)
        {
            set.Remove(entity);
        }
        public async Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>>? filter = null , Expression<Func<T, object>>[]? includes = null , bool trackChanges = false)
        {
            var entities = set.AsQueryable();
            //Filtration
            if (filter is not null)
                entities = entities.Where(filter);
            //including related entities
            if (includes is not null)
                foreach (var include in includes)
                    entities = entities.Include(include);
            //Tracking changes
            if (!trackChanges)
                entities = entities.AsNoTracking();

            return await entities.ToListAsync();
        }
        public async Task<T?> GetOneAsynch(Expression<Func<T, bool>>? filter = null, Expression<Func<T, object>>[]? includes = null, bool trackChanges = false)
        {
            //get one element
            return (await GetAsync(filter, includes, trackChanges)).FirstOrDefault();
        }

        public async Task<bool> ExistsAsync(Expression<Func<T, bool>>? filter = null)
        {
            return await set.AnyAsync(filter);
        }
    }
}
