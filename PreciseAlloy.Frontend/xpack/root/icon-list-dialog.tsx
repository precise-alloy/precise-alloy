import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface ParsedSvgSymbol {
  id: string;
  viewBox: string;
  svgContent: string;
}

function parseAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let match: RegExpExecArray | null;

  while ((match = attrRegex.exec(tag)) !== null) {
    attrs[match[1]] = match[2] ?? match[3] ?? '';
  }

  return attrs;
}

function extractSymbols(svgContent: string): Array<{ attrs: Record<string, string>; inner: string }> {
  const results: Array<{ attrs: Record<string, string>; inner: string }> = [];

  const symbolRegex = /<symbol([^>]*)>([\s\S]*?)<\/symbol>/gi;
  let match: RegExpExecArray | null;

  while ((match = symbolRegex.exec(svgContent)) !== null) {
    const attrs = parseAttributes(match[1]);
    const inner = match[2].trim();

    results.push({ attrs, inner });
  }

  return results;
}

function parseSvgSprite(svgContent: string): ParsedSvgSymbol[] | null {
  const trimmed = svgContent.trim();

  if (!/^\s*<svg[\s>]/i.test(trimmed)) {
    return null;
  }

  const symbols = extractSymbols(trimmed);

  if (symbols.length < 2) {
    return null;
  }

  return symbols.map(({ attrs, inner }) => {
    const id = attrs['id'] ?? '';
    const viewBox = attrs['viewBox'] ?? attrs['viewbox'] ?? '0 0 24 24';

    const extraAttrs = Object.entries(attrs)
      .filter(([key]) => !['id'].includes(key))
      .map(([key, val]) => `${key}="${val}"`)
      .join(' ');

    const svgOut = `<svg xmlns="http://www.w3.org/2000/svg" ${extraAttrs}>\n${inner}\n</svg>`;

    return { id, viewBox, svgContent: svgOut };
  });
}

function SvgIcon({
  id,
  viewBox,
  svgContent,
  copySvgId,
}: ParsedSvgSymbol & {
  copySvgId: (id: string, el: HTMLElement | null) => void;
}) {
  const inner = svgContent.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  let tooltipRef = useRef<HTMLElement>(null);

  return (
    <button className="xpack-o-icon-list-dialog__item" onClick={() => copySvgId(id, tooltipRef.current)}>
      <span className="xpack-o-icon-list-dialog__copy-tooltip" ref={tooltipRef}>
        Copied!
      </span>
      <svg dangerouslySetInnerHTML={{ __html: inner }} aria-label={id} height={24} viewBox={viewBox} width={24} xmlns="http://www.w3.org/2000/svg" />
      <span className="xpack-o-icon-list-dialog__icon-id">{id}</span>
    </button>
  );
}

const sprites = import.meta.glob(['../../public/assets/images/*.svg', '!../../public/assets/images/root.svg'], {
  query: '?raw',
  import: 'default',
});

const IconListDialog = () => {
  const [allSvgs, setAllSvgs] = useState<ParsedSvgSymbol[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const parseSvg = async () => {
    const data = [];

    for (const [_, load] of Object.entries(sprites)) {
      const content = (await load()) as string;
      const parsed = parseSvgSprite(content);

      if (parsed) {
        data.push(...parsed);
      }
    }

    setAllSvgs(data);
  };

  const filteredSvgs = useMemo(() => allSvgs.filter((s) => s.id.toLowerCase().includes(searchValue.toLowerCase())), [allSvgs, searchValue]);

  const copySvgId = useCallback(async (id: string, el: HTMLElement | null) => {
    if (!el) return;

    try {
      await navigator.clipboard.writeText(`#${id}`);

      el?.classList?.add?.('show');

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        el?.classList?.remove?.('show');
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSearchIcon = (e: ChangeEvent) => {
    const val = (e.target as HTMLInputElement).value;

    setSearchValue(val);
  };

  useEffect(() => {
    parseSvg();
  }, []);

  return (
    <dialog className="xpack-o-icon-list-dialog" id="icon-list-dialog">
      <p>Total: {allSvgs.length} icons</p>

      <div className="xpack-o-icon-list-dialog__search">
        <input placeholder="Search for icon" value={searchValue} onChange={handleSearchIcon} />
      </div>

      <div className="xpack-o-icon-list-dialog__svg-list">
        {filteredSvgs.map((svg, i) => (
          <SvgIcon key={i} copySvgId={copySvgId} id={svg.id} svgContent={svg.svgContent} viewBox={svg.viewBox} />
        ))}
      </div>

      <button
        {...{
          command: 'close',
          commandfor: 'icon-list-dialog',
        }}
      >
        Close
      </button>
    </dialog>
  );
};

export default IconListDialog;
