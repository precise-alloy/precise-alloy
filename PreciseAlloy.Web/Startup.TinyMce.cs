using EPiServer.Cms.TinyMce.Core;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web;

public partial class Startup
{
    private static void ConfigureTinyMce(IServiceCollection services)
    {
        // ReSharper disable StringLiteralTypo
        services.Configure<TinyMceConfiguration>(config =>
        {
            config
                .Default()
                .Menubar("file edit insert view format tools")
                .AddEpiserverSupport()
                .AddPlugin(
                    "epi-link epi-personalized-content preview searchreplace autolink directionality visualblocks visualchars fullscreen link media template charmap table pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help anchor code")
                .Toolbar(
                    "formatselect styles | bold italic | cut copy paste pastetext removeformat | epi-personalized-content | table",
                    "bullist numlist outdent indent | alignleft aligncenter alignright | epi-link unlink anchor | fullscreen | code")
                .BodyClass("zzz-rich-text-box")
                .AddSiteCss(
                    HtmlExtensions.GetCacheBusterPath("/assets/css/style-base.css"),
                    HtmlExtensions.GetCacheBusterPath("/assets/css/b-tiny-mce.css"),
                    HtmlExtensions.GetCacheBusterPath("/assets/css/b-rich-text-box.css"));
        });
        // ReSharper restore StringLiteralTypo
    }
}
