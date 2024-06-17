﻿using System.Reflection;
using EPiServer.PlugIn;
using Geta.Optimizely.ContentTypeIcons.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using PreciseAlloy.Jobs;
using PreciseAlloy.Models.Blocks;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Services.Settings;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web.Features.Blocks.TypeAlert;

public class TypeAlertViewComponent(IRequestContext requestContext) : ViewComponent
{
    private static readonly IList<string> AlertMessages;

    static TypeAlertViewComponent()
    {
        var typesForAssemblyScanning = new[] {
            typeof(ScheduledJobBase),   // PreciseAlloy.Jobs
            typeof(BaseBlockData),      // PreciseAlloy.Models
            typeof(ISettingsService),   // PreciseAlloy.Services
            typeof(HtmlExtensions),     // PreciseAlloy.Utils
            typeof(Program)             // PreciseAlloy.Web
        };

        AlertMessages = ValidateContentTypes(typesForAssemblyScanning);
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        if (!AlertMessages.Any()
            || requestContext.IsBlockPreviewMode
            || (requestContext.CurrentPage() as SitePageData)?.HideSiteHeader == true)
        {
            return new ContentViewComponentResult(string.Empty);
        }

        return await Task.FromResult(View(AlertMessages));
    }

    private static IList<string> ValidateContentTypes(IEnumerable<Type> typesForAssemblyScanning)
    {
        var messages = new List<string>();

        var assemblies = typesForAssemblyScanning
            .SelectMany(t => t.Assembly.GetTypes())
            .ToList();

        var blockOrPageTypes = assemblies
            .Where(myType => myType is { IsClass: true, IsAbstract: false }
                             && myType.IsSubclassOf(typeof(ContentData)));

        foreach (Type type in blockOrPageTypes)
        {
            var contentType = type.GetCustomAttribute<ContentTypeAttribute>();
            if (contentType == null
                || string.IsNullOrWhiteSpace(contentType.DisplayName)
                || string.IsNullOrWhiteSpace(contentType.GUID))
            {
                messages.Add($"<strong>ContentType</strong> attribute with Display Name and unique GUID is required for {type.Namespace}.<strong>{type.Name}</strong>.");
            }

            var icon = type.GetCustomAttribute<ContentTypeIconAttribute>();
            if (icon is null)
            {
                messages.Add($"<strong>ContentTypeIcon</strong> attribute is required for {type.Namespace}.<strong>{type.Name}</strong>.");
            }
        }

        var scheduleJobs = assemblies
            .Where(myType => myType is { IsClass: true, IsAbstract: false }
                             && myType.IsSubclassOf(typeof(ScheduledJobBase)));

        foreach (Type scheduleJob in scheduleJobs)
        {
            var scheduledPlugInAttribute = scheduleJob.GetCustomAttribute<ScheduledPlugInAttribute>();
            if (scheduledPlugInAttribute == null
                || string.IsNullOrWhiteSpace(scheduledPlugInAttribute.DisplayName)
                || string.IsNullOrWhiteSpace(scheduledPlugInAttribute.GUID))
            {
                messages.Add($"<strong>ScheduledPlugIn</strong> attribute with Display Name and unique GUID is required for {scheduleJob.Namespace}.<strong>{scheduleJob.Name}</strong>.");
            }
        }

        return messages;
    }
}