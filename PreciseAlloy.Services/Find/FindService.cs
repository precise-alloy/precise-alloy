using PreciseAlloy.Models.Pages;
using EPiServer.Core;
using EPiServer.Find;
using EPiServer.Find.Cms;
using Microsoft.Extensions.Logging;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Services.Find;

// ReSharper disable once UnusedMember.Global
public class FindService : IFindService
{
    private readonly IClient _client;
    private readonly ILogger _logger;

    public FindService(
        IClient client,
        ILogger logger)
    {
        _logger = logger;
        _logger.EnterConstructor();
        _client = client;
        _logger.ExitConstructor();
    }

    public IContentResult<T>? Search<T>(
        FindQuery query)
        where T : SitePageData
    {
        _logger.EnterMethod();
        var pages = GetPages<T>(query);

        _logger.ExitMethod();
        return pages;
    }

    public IContentResult<T>? Search<T>(
        FindQuery query,
        out int totalRows)
        where T : SitePageData
    {
        _logger.EnterMethod();
        var results = GetPages<T>(query);
        totalRows = results?.TotalMatching ?? 0;

        _logger.ExitMethod();
        return results;
    }

    public IContentResult<T>? GetBlocks<T>(
        FindQuery query)
        where T : BlockData
    {
        try
        {
            _logger.EnterMethod();
            var search = _client.Search<T>();

            search = search
                .ApplyBestBets()
                .CurrentlyPublished()
                .PublishedInCurrentLanguage()
                .ExcludeDeleted()
                .FilterForVisitor();

            _logger.ExitMethod();
            return search.Take(query.PageSize).GetContentResult();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Fail to search for blocks");
            return null;
        }
    }

    private IContentResult<T>? GetPages<T>(FindQuery query) where T : SitePageData
    {
        try
        {
            var search = _client.Search<T>();

            if (!string.IsNullOrWhiteSpace(query.Keyword))
            {
                search = search.For(Uri.UnescapeDataString(query.Keyword));
            }

            search = search
                    .ApplyBestBets()
                    .CurrentlyPublished()
                    .PublishedInCurrentLanguage()
                    .ExcludeDeleted()
                    .FilterForVisitor();

            var rootPageId = string.IsNullOrWhiteSpace(query.RootPageId)
                ? ContentReference.StartPage.ID.ToString()
                : query.RootPageId;

            search = search
                .Filter(x => x
                    .Ancestors()
                    .Match(rootPageId));

            if (query is { IsNext: true, StartPublish: { } })
            {
                search = search
                    .Filter(e => e
                        .StartPublish
                        .GreaterThan(query.StartPublish.GetValueOrDefault()))
                    .OrderBy(e => e.StartPublish);
            }
            else
            {
                search = search
                    .OrderByDescending(x => x.StartPublish);
            }

            if (query is { IsPrevious: true, StartPublish: { } })
            {
                search = search
                    .Filter(e => e
                        .StartPublish
                        .LessThan(query.StartPublish.GetValueOrDefault()));
            }

            query.PageIndex = query.PageIndex <= 0 ? 1 : query.PageIndex;

            _logger.ExitMethod();
            return search
                .Skip((query.PageIndex - 1) * query.PageSize)
                .Take(query.PageSize)
                .GetContentResult();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Fail to search for pages");
            return null;
        }
    }
}
