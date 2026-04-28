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
  }

  if (typeof css === 'string') {
    return (
      <>
        <RequireCss path={css} />
        <script dangerouslySetInnerHTML={innerHtml} data-rct={type} type="application/json" />
      </>
    );
  }

  // css is `string[]` here: the prop type narrows to `string | string[]` and
  // the previous branches cover `undefined` and `string`.
  return (
    <>
      {css.map((i) => (
        <RequireCss key={i} path={i} />
      ))}
      <script dangerouslySetInnerHTML={innerHtml} data-rct={type} type="application/json" />
    </>
  );
};

export default ReactSection;
