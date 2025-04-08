using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service.Service;

namespace Service.Controllers
{
    public class BaseController<TEntity, TKey>(IServiceBase<TEntity, TKey> service) : ControllerBase
    {
        protected IServiceBase<TEntity, TKey> baseService = service;

        [HttpGet]
        public IActionResult Get([FromQuery] Filter filter)
        {
            try
            {
                return Ok(baseService.Get(filter));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("get-all")]
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                return Ok(baseService.GetAll());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("{key}")]
        [HttpGet]
        public IActionResult GetById(TKey key)
        {
            try
            {
                return Ok(baseService.GetById(key));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult Post(TEntity article)
        {
            try
            {
                baseService.Insert(article);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("{key}")]
        [HttpPut]
        public IActionResult Put(TKey key, TEntity entity)
        {
            try
            {
                baseService.Update(key, entity);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("{key}")]
        [HttpDelete]
        public IActionResult Delete(TKey key)
        {
            try
            {
                baseService.DeleteById(key);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
