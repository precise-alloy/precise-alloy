import { viteAbsoluteUrl } from './functions';

interface Props {
  path: string;
  async?: boolean;
  defer: boolean;
  type?: 'module' | 'text/javascript';

  // If set, it will not be relocated in to <head> element
  inplace?: boolean;
}

const RequireJs = ({ path, async, defer, inplace, type }: Props) => {
  const normalizedPath = /^https?:\/\//gi.test(path)
    ? path
    : path.startsWith('vendors/')
      ? viteAbsoluteUrl('/assets/') + path + '.js'
      : viteAbsoluteUrl('/assets/js/' + path + '.js');

  return <script data-pl-require async={async} data-pl-inplace={inplace} defer={defer} src={normalizedPath} type={type ?? 'module'} />;
};

export { RequireJs };
export default RequireJs;
