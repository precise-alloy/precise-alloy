using Advanced.CMS.GroupingHeader;
using Baaijte.Optimizely.ImageSharp.Web;
using EPiServer.Cms.Shell;
using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.Scheduler;
using EPiServer.Web;
using EPiServer.Web.Mvc.Html;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Mvc.RazorPages;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Services.Settings;
using PreciseAlloy.Web.Infrastructure;

namespace PreciseAlloy.Web;

public class Startup
{
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly IConfiguration _configuration;

    public Startup(
        IWebHostEnvironment webHostEnvironment,
        IConfiguration configuration)
    {
        _webHostEnvironment = webHostEnvironment;
        _configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        if (_webHostEnvironment.IsDevelopment())
        {
            var appDataPath = Path.Combine(_webHostEnvironment.ContentRootPath, "App_Data");
            AppDomain.CurrentDomain.SetData("DataDirectory", appDataPath);

            services.Configure<SchedulerOptions>(options => options.Enabled = false);
        }
        else
        {
            services.AddCmsCloudPlatformSupport(_configuration);
        }

        var mvcBuilder = services
            .AddMvc(o => o.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true)
            .AddRazorOptions(x => { x.ViewLocationExpanders.Add(new CustomViewLocationExpander()); });

        if (_webHostEnvironment.IsDevelopment())
        {
            mvcBuilder.AddRazorRuntimeCompilation();
        }

        services
            .AddCmsAspNetIdentity<ApplicationUser>()
            .AddCms()
            .AddFind()
            .AddAdminUserRegistration()
            .AddEmbeddedLocalization<Startup>()
            .ConfigureImageResizing(_configuration, _webHostEnvironment)
            .Configure<UrlSegmentOptions>(o =>
            {
                o.SupportIriCharacters = true;
                o.ValidCharacters = @"\p{L}0-9\-_~\.\$";
            });

        services.AddTransient<ContentAreaRenderer, CustomContentAreaRenderer>();
        services.AddSingleton<ISettingsService, SettingsService>();
        services.AddScoped<IRequestContext, RequestContext>();
        services.Configure<RazorPagesOptions>(options => options.RootDirectory = "/Features");

        // Add GroupingHeader
        // https://github.com/advanced-cms/grouping-header/
        services.AddGroupingHeader();
    }

    public void Configure(
        IApplicationBuilder app,
        IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseStaticFiles();
        app.UseRouting();
        app.UseCors();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseBaaijteOptimizelyImageSharp();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(name: "Default", pattern: "{controller}/{action}/{id?}");
            endpoints.MapControllers();
            endpoints.MapRazorPages();
            endpoints.MapContent();
        });
    }
}