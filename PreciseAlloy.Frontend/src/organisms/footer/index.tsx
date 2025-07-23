import { FooterModel } from '@_types/types';
import RequireCss from '@helpers/RequireCss';
import { getModifiers } from '@helpers/functions';
import LinkListWithIcon from '@molecules/links';

const Footer = (model: FooterModel) => {
  const styleModifiers = getModifiers(model, 'zzz-o-footer');
  const { linkList, copyright } = model;

  return (
    <footer className={styleModifiers}>
      <div className="zzz-container">
        <div className="zzz-o-footer__inner">
          {linkList && <LinkListWithIcon {...linkList} />}

          {copyright && <div dangerouslySetInnerHTML={{ __html: copyright }} className="zzz-o-footer__copyright" />}
        </div>
      </div>
      <RequireCss path="b-footer" />
    </footer>
  );
};

export default Footer;
