import { RootModel } from '@_types/types';
import RequireJs from '@helpers/RequireJs';
import ReactSection from '@helpers/ReactSection';

export default function Template(model: RootModel) {
  return (
    <main className="xpack-t-root">
      {model && <ReactSection css={'root'} data={model} type="root" />}

      <div className="xpack-t-root__target-wrapper" id="root-iframe-wrapper">
        <iframe
          className="xpack-t-root__target"
          id="root-iframe"
          name="inner"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads allow-popups-to-escape-sandbox allow-presentation allow-top-navigation"
          title="Pages"
        />
        <div className="xpack-t-root__target-resizer" id="root-iframe-resizer" />
        <RequireJs defer path="root" />
      </div>
    </main>
  );
}
