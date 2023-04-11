import { FooterModel } from '@_types/types';
import RequireCss from '@helpers/RequireCss';
import { getModifiers } from '@helpers/functions';
import LinkListWithIcon from '@molecules/link-list/LinkListWithIcon';

const Footer = (model: FooterModel) => {
  const styleModifiers = getModifiers(model, 'zzz-o-footer');
  const { linkList } = model;

  return (
    <footer className={styleModifiers}>
      <div className="zzz-container">
        <div className="zzz-o-footer__inner">
          {linkList && <LinkListWithIcon {...linkList} />}

          <div className="zzz-o-footer__copyright">
            <p>© Start, 2022. All rights reserved.</p>
          </div>
        </div>
      </div>
      <RequireCss path="b-footer" />
    </footer>
  );
};

export default Footer;
