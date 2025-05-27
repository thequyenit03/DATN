using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Dialogflow.V2;

namespace Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatBotController : ControllerBase
    {
        private readonly SessionsClient _sessionsClient;
        private readonly string _projectId;

        public ChatBotController(IConfiguration config)
        {
            System.Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS",
                config["Dialogflow:CredentialPath"]);
            _sessionsClient = SessionsClient.Create();
            _projectId = config["Dialogflow:ProjectId"];
        }        
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ChatRequest req)
        {
            var sessionName = new SessionName(_projectId, req.SessionId);
            var queryInput = new QueryInput
            {
                Text = new TextInput
                {
                    Text = req.Message,
                    LanguageCode = "vi"
                }
            };
            var response = await _sessionsClient.DetectIntentAsync(sessionName, queryInput);
            return Ok(new { reply = response.QueryResult.FulfillmentText });
        }
    }
}
public class ChatRequest
{
    public string SessionId { get; set; }
    public string Message { get; set; }
}
