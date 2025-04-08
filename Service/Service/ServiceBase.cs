using Service.Dto;

namespace Service.Service
{
    public interface IServiceBase<TEntity, TKey>
    {
        List<TEntity> Get(Filter filter);
        List<TEntity> GetAll();
        TEntity GetById(TKey key);
        TEntity Insert(TEntity entity);
        void Update(TKey key, TEntity entity);
        void DeleteById(TKey key);
    }
}
