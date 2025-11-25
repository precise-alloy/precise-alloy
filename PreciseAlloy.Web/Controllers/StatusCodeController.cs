using System.Net;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Pages.NotFound;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Settings;

namespace PreciseAlloy.Web.Controllers;

[Route("status-code")]
public class StatusCodeController(
    ISettingsService settingsService,
    IContentLoader contentLoader)
    : Controller
{
    [Route("404")]
    public async Task<IActionResult> PageNotFound()
    {
        var notFoundRef = settingsService.GetSiteSettings<LayoutSettings>()?.NotFound;
        if (ContentReference.IsNullOrEmpty(notFoundRef))
        {
            return Content("404 content link is not configured in layout setting yet.");
        }

        var page = contentLoader.Get<NotFoundPage>(notFoundRef, []);
        if (page is null)
        {
            return Content("404 page is configured with incorrect content page type, it has to be ");
        }

        HttpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;

        var model = new NotFoundPageViewModel(page);

        return await Task.FromResult(View(model));
    }

    [Route("500")]
    public async Task<IActionResult> ServerError()
    {
        HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        return await Task.FromResult(View());
    }

    [Route("check")]
    public Task<IActionResult> ErrorCheck()
    {
        throw new NotImplementedException();
    }
}