using Advanced.CMS.GroupingHeader;
using Baaijte.Optimizely.ImageSharp.Web;
using EPiServer.Cms.Shell;
using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.Framework.Web.Resources;
using EPiServer.Scheduler;
using EPiServer.Web;
using EPiServer.Web.Mvc.Html;
using EPiServer.Web.Routing;
using Geta.Optimizely.ContentTypeIcons.Infrastructure.Configuration;
using Geta.Optimizely.ContentTypeIcons.Infrastructure.Initialization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Services.Settings;
using PreciseAlloy.Web.Infrastructure;

namespace PreciseAlloy.Web;

public class Startup(
    IWebHostEnvironment webHostEnvironment,
    IConfiguration configuration)
{
    public void ConfigureServices(IServiceCollection services)
    {
        if (webHostEnvironment.IsDevelopment())
        {
            // Set App_Data path
            var appDataPath = Path.Combine(webHostEnvironment.ContentRootPath, "App_Data");
            AppDomain.CurrentDomain.SetData("DataDirectory", appDataPath);

            // Disable scheduler
            services.Configure<SchedulerOptions>(options => options.Enabled = false);

            // UI
            services.Configure<ClientResourceOptions>(uiOptions =>
            {
                uiOptions.Debug = true;
            });
        }
        else
        {
            services.AddCmsCloudPlatformSupport(configuration);
        }

        var mvcBuilder = services
            .AddMvc(o => o.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true)
            .AddRazorOptions(x => { x.ViewLocationExpanders.Add(new CustomViewLocationExpander()); });

        services.AddContentTypeIcons(x =>
        {
            x.EnableTreeIcons = true;
            x.ForegroundColor = "#ffffff";
            x.BackgroundColor = "#a1331f";
            x.FontSize = 40;
            x.CustomFontPath = Path.Combine(webHostEnvironment.WebRootPath, "assets", "fonts");
            x.CachePath = Path.Combine(webHostEnvironment.ContentRootPath, "App_Data", "thumb_cache");
        });

        if (webHostEnvironment.IsDevelopment())
        {
            mvcBuilder.AddRazorRuntimeCompilation();
        }

        services
            .AddCmsAspNetIdentity<ApplicationUser>()
            .AddCms()
            .AddFind()
            .AddAdminUserRegistration()
            .AddEmbeddedLocalization<Startup>()
            .ConfigureImageResizing(configuration, webHostEnvironment)
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

        if (IsIntegrationOrLower())
        {
            services.AddSwaggerGen(options =>
            {
                // var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                // options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
            });
        }
    }

    public void Configure(
        IApplicationBuilder app)
    {
        if (webHostEnvironment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        if (IsIntegrationOrLower())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseStaticFiles();
        app.UseRouting();
        app.UseCors();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseBaaijteOptimizelyImageSharp();

        app.UseContentTypeIcons();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(name: "Default", pattern: "{controller}/{action}/{id?}");
            endpoints.MapControllers();
            endpoints.MapRazorPages();
            endpoints.MapContent();
        });
    }

    private bool IsIntegrationOrLower()
    {
        return webHostEnvironment.IsDevelopment()
               || webHostEnvironment.IsEnvironment("Integration");
    }
}