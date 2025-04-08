namespace Service.Dto
{
    public class UserDto
    {
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public DateTime? LastLogin { get; set; }
        public bool? Active { get; set; }
    }
}
