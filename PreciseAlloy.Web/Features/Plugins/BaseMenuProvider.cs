using EPiServer.Shell.Navigation;

namespace PreciseAlloy.Web.Features.Plugins;

public abstract class BaseMenuProvider
    : IMenuProvider
{
    public abstract IEnumerable<MenuItem> GetMenuItems();

    protected static bool HasAdminRole(HttpContext context)
    {
        return context.User.IsInRole("CmsAdmins") || context.User.IsInRole("Administrators");
    }
}
