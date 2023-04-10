using EPiServer.Cms.Shell;
using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.Scheduler;
using EPiServer.Web;
using EPiServer.Web.Mvc.Html;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Mvc.RazorPages;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Web.Infrastructure;

namespace PreciseAlloy.Web;

public class Startup
{
    private readonly IWebHostEnvironment _webHostingEnvironment;

    public Startup(IWebHostEnvironment webHostingEnvironment)
    {
        _webHostingEnvironment = webHostingEnvironment;
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

        services
            .AddMvc(o => o.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true)
            .AddRazorOptions(x => x.ConfigureRazor());

        services
            .AddCmsAspNetIdentity<ApplicationUser>()
            .AddCms()
            .AddFind()
            .AddAdminUserRegistration()
            .AddEmbeddedLocalization<Startup>();

        services.AddTransient<ContentAreaRenderer, CustomContentAreaRenderer>();
        services.AddScoped<IRequestContext, RequestContext>();
        services.Configure<RazorPagesOptions>(options => options.RootDirectory = "/Features");
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
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapContent();
        });
    }
}
