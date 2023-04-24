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
    private readonly IWebHostEnvironment _webHostingEnvironment;
    private IConfiguration _configuration;
    public Startup(IWebHostEnvironment webHostingEnvironment, IConfiguration configuration)
    {
        _webHostingEnvironment = webHostingEnvironment;
        _configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        if (_webHostingEnvironment.IsDevelopment())
        {
            AppDomain.CurrentDomain.SetData(
                "DataDirectory",
                Path.Combine(_webHostingEnvironment.ContentRootPath, "App_Data"));

            services.Configure<SchedulerOptions>(options => options.Enabled = false);
        }

        var mvcBuilder = services
            .AddMvc(o => o.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true)
            .AddRazorOptions(x => x.ConfigureRazor());
        if (_webHostingEnvironment.IsDevelopment())
        {
            mvcBuilder.AddRazorRuntimeCompilation();
        }

        services
            .AddCmsAspNetIdentity<ApplicationUser>()
            .AddCms()
            .AddFind()
            .AddAdminUserRegistration()
            .AddEmbeddedLocalization<Startup>()
            .ConfigureImageResizing(_configuration, _webHostingEnvironment)
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
