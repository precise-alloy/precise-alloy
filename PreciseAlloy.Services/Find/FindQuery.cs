namespace PreciseAlloy.Services.Find;

public class FindQuery
{
    public string? Keyword { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    public string? RootPageId { get; set; }

    public DateTime? StartPublish { get; set; }

    public bool IsNext { get; set; }

    public bool IsPrevious { get; set; }

    public bool ExcludeRedirectPage { get; set; }
}
