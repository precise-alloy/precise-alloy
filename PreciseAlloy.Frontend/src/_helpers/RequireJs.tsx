interface Props {
  path: string;
  async?: boolean;
  defer: boolean;
  type?: 'module' | 'text/javascript';

  // If set, it will not be relocated in to <head> element
  inplace?: boolean;
}

const RequireJs = ({ path, async, defer, inplace, type }: Props) => {
  const normalizedPath = /^https?:\/\//gi.test(path) ? path : path.startsWith('vendors/') ? '/assets/' + path + '.js' : '/assets/js/' + path + '.js';

  return <script type={type ?? 'module'} async={async} defer={defer} src={normalizedPath} data-pl-require data-pl-inplace={inplace}></script>;
};

export { RequireJs };
export default RequireJs;
