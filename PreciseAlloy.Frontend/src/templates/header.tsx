import RequireCss from '@helpers/RequireCss';
import RequireJs from '@helpers/RequireJs';
import Header from '@organisms/header';

// Static pages register resources here; the CMS header view registers its own.
// The client registry imports the markup-only Header, never this template.
export default function TemplateHeader(props: HeaderModel) {
  return (
    <>
      <Header {...props} />
      <RequireJs defer path="header" />
      <RequireCss path="b-header" />
    </>
  );
}
