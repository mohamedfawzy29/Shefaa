
namespace Shefaa.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected ApplicationDbContext context;
        DbSet<T> set;
        public Repository(ApplicationDbContext context)
        {
            this.context = context;
            set = context.Set<T>();
        }

        public async Task<int> CommitChangesAsync()
        {
            try
            {
                return await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return 0;
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
    }
}
