import RequireCss from './RequireCss';

interface Model {
  type: string;
  data: unknown;
  css?: string | string[];
}
const ReactSection = ({ type, data, css }: Model) => {
  const innerHtml = { __html: JSON.stringify(data, null, '') };

  if (!css) {
    return <script dangerouslySetInnerHTML={innerHtml} data-rct={type} type="application/json" />;
  } else if (typeof css === 'string') {
    return (
      <>
        <RequireCss path={css} />
        <script dangerouslySetInnerHTML={innerHtml} data-rct={type} type="application/json" />
      </>
    );
  } else if (typeof css === 'object') {
    const cssItems = css as string[];

    return (
      <>
        {cssItems.map((i) => (
          <RequireCss key={i} path={i} />
        ))}
        <script dangerouslySetInnerHTML={innerHtml} data-rct={type} type="application/json" />
      </>
    );
  } else {
    return <></>;
  }
};

export default ReactSection;
