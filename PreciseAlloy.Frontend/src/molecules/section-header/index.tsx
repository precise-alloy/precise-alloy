import { getModifiers } from '@helpers/functions';
import { SectionHeaderModel } from '@_types/types';

const SectionHeader = (model: SectionHeaderModel) => {
  const { heading, headingLevel } = model;
  const styleModifiers = getModifiers(model, 'zzz-m-section-header');

  return (
    <div className={styleModifiers}>
      {headingLevel === 'h1' ? (
        <h1 dangerouslySetInnerHTML={{ __html: heading }} className="zzz-m-section-header__heading" />
      ) : (
        <h2 dangerouslySetInnerHTML={{ __html: heading }} className="zzz-m-section-header__heading h1" />
      )}
    </div>
  );
};

export { SectionHeader };
export default SectionHeader;
