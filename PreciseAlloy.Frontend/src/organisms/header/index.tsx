import { getModifiers } from '@helpers/functions';
import RequireCss from '@helpers/RequireCss';
import RequireJs from '@helpers/RequireJs';
import { HeaderModel } from '@_types/organisms';
import Icon from '@atoms/icons';

const Header = (model: HeaderModel) => {
  const modifiers = getModifiers(model, 'zzz-o-header');
  const { title, navlinks, logo } = model;
  const defaultLogoUrl = '/assets/images/logo.svg';

  return (
    <header className={modifiers}>
      <div className="zzz-container">
        <div className="zzz-o-header__header-container">
          <a href="/pages/home.html">
            <img alt="Precise Alloy's logo" className="zzz-o-header__logo" height={50} src={logo?.src ?? defaultLogoUrl} width={70} />
          </a>

          <span className="zzz-o-header__title">{title}</span>

          {navlinks?.links && (
            <>
              <div className="zzz-o-header__nav-mobile">
                <div className={'zzz-o-header__nav-toggle'}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <ul className={'zzz-o-header__nav-list'}>
                {navlinks.links.map((link) => (
                  <li key={link.text} className="zzz-o-header__nav-list__item">
                    <a href={link.url}>{link.text}</a>
                  </li>
                ))}

                <li className="zzz-o-header__theme-toggle">
                  <button aria-label="Toggle Theme">
                    <Icon iconPath={'#zzz-theme-light'} viewBoxHeight={19} viewBoxWidth={19} />

                    <Icon iconPath={'#zzz-theme-moon'} viewBoxHeight={19} viewBoxWidth={19} />
                  </button>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>

      <RequireJs defer path="header" />
      <RequireCss path="b-header" />
    </header>
  );
};

export default Header;
