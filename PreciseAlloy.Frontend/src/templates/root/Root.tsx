import RequireCss from '@helpers/RequireCss';
import RequireJs from '@helpers/RequireJs';
import { RootModel } from '@_types/types';

const Root = (model: RootModel) => {
  return (
    <main className="xpack-t-root">
      <script data-rct="root" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(model, null, '  ') }}></script>

      <div id="root-iframe-wrapper" className="xpack-t-root__target-wrapper">
        <iframe
          id="root-iframe"
          className="xpack-t-root__target"
          name="inner"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads allow-popups-to-escape-sandbox allow-presentation allow-top-navigation"
        />
        <div id="root-iframe-resizer" className="xpack-t-root__target-resizer"></div>
        <RequireJs path="root" defer />
      </div>
      <RequireCss path="p-root" />
    </main>
  );
};

export default Root;
