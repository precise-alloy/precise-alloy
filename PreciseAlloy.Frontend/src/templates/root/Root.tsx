import RequireJs from '@helpers/RequireJs';
import { RootModel } from '@_types/types';
import ReactSection from '@helpers/ReactSection';

const Root = (model: RootModel) => {
  return (
    <main className="xpack-t-root">
      {model && <ReactSection type='root' data={model} css={'p-root'} />}

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
    </main>
  );
};

export default Root;
