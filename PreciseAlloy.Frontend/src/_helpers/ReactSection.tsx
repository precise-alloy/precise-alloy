import RequireCss from "./RequireCss";

interface Model {
  type: string;
  data: unknown;
  css?: string | string[];
}
const ReactSection = ({ type, data, css }: Model) => {
  const innerHtml = { __html: JSON.stringify(data, null, '') };
  if (!css) {
    return <script data-rct={type} type="application/json" dangerouslySetInnerHTML={innerHtml}></script>
  }
  else if (typeof css === 'string') {
    return <>
      <script data-rct={type} type="application/json" dangerouslySetInnerHTML={innerHtml}></script>
      <RequireCss path={css} />
    </>
  } else if (typeof css === 'object') {
    const cssItems = css as string[];
    return <>
      <script data-rct={type} type="application/json" dangerouslySetInnerHTML={innerHtml}></script>
      {cssItems.map(i => <RequireCss path={i} />)}
    </>
  } else {
    return <></>
  }
}

export default ReactSection;
