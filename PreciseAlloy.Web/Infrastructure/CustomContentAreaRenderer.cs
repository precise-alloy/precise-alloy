using EPiServer.ServiceLocation;
using EPiServer.Web.Mvc;
using EPiServer.Web;
using EPiServer.Web.Mvc.Html;
using EPiServer.Web.Templating;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace PreciseAlloy.Web.Infrastructure
{
    public class CustomContentAreaRenderer
        : ContentAreaRenderer
    {
        private readonly IContentAreaLoader _contentAreaLoader = ServiceLocator.Current.GetInstance<IContentAreaLoader>();
        private readonly IContentRenderer _contentRenderer = ServiceLocator.Current.GetInstance<IContentRenderer>();


        protected override void RenderContentAreaItem(IHtmlHelper htmlHelper, ContentAreaItem contentAreaItem,
            string templateTag, string htmlTag,
            string cssClass)
        {
            bool.TryParse(htmlHelper.ViewContext.ViewData["legacyMode"] + "", out var enableLegacyMode);
            if (enableLegacyMode)
            {
                base.RenderContentAreaItem(htmlHelper, contentAreaItem, templateTag, htmlTag, cssClass);
                return;
            }

            IDictionary<string, object> renderSettings = new Dictionary<string, object>();
            if (contentAreaItem.RenderSettings != null)
            {
                renderSettings = contentAreaItem.RenderSettings;
            }

            htmlHelper.ViewBag.RenderSettings = renderSettings;

            var content = _contentAreaLoader.LoadContent(contentAreaItem);
            if (content is null)
            {
                return;
            }

            using (new ContentRenderingScope(htmlHelper.ViewContext.HttpContext, content))
            {
                var template = ResolveContentTemplate(htmlHelper, content, new[] { templateTag });
                if (template != null
                    || IsInEditMode())
                {
                    htmlHelper.RenderContentData(content, true, template, _contentRenderer);
                }
            }
        }

        protected override bool ShouldRenderWrappingElement(IHtmlHelper htmlHelper) => false;
    }
}
