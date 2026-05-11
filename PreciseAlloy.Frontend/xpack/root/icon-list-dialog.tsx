import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as cheerio from 'cheerio';

export interface ParsedSvgSymbol {
  id: string;
  viewBox: string;
  svgContent: string;
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

  const parseSvg = async (): Promise<ParsedSvgSymbol[]> => {
    const data: ParsedSvgSymbol[] = [];

    for (const load of Object.values(sprites)) {
      const content = (await load()) as string;
      const $ = cheerio.load(content, { xmlMode: true });

      $('symbol').each((_, el) => {
        const id = $(el).attr('id');

        if (!id) return;

        data.push({
          id,
          svgContent: $(el).html() ?? '',
          viewBox: $(el).attr('viewBox') ?? '',
        });
      });
    }

    return data;
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
    parseSvg().then((data) => setAllSvgs(data));
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
