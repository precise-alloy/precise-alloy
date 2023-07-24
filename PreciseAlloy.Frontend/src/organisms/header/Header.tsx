import { getModifiers } from '@helpers/functions';
import RequireCss from '@helpers/RequireCss';
import RequireJs from '@helpers/RequireJs';
import { HeaderModel } from '@_types/organisms';
import Icon from '@atoms/icons/Icon';

const Header = (model: HeaderModel) => {
  const modifiers = getModifiers(model, 'zzz-o-header');
  const { title, navlinks, logo } = model;
  const defaultLogoUrl = '/assets/images/logo.svg';

  return (
    <header className={modifiers}>
      <div className="zzz-container">
        <div className="zzz-o-header__header-container">
          <a href="#">
            <img className="zzz-o-header__logo" width={70} height={50} alt="Precise Alloy's logo" src={logo?.src ?? defaultLogoUrl} />
          </a>

          <span className="zzz-o-header__title">{title}</span>

          {navlinks?.links && (
            <>
              <div className="zzz-o-header__nav-mobile">
                <div className={`zzz-o-header__nav-toggle`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              <ul className={`zzz-o-header__nav-list`}>
                {navlinks.links.map((link) => (
                  <li key={link.text} className="zzz-o-header__nav-list__item">
                    <a href={link.url}>{link.text}</a>
                  </li>
                ))}

                <li className="theme-toggle">
                  <a aria-label="Toggle Theme">
                    <Icon iconPath={'#zzz-theme-light'} viewBoxWidth={19} viewBoxHeight={19} />

                    <Icon iconPath={'#zzz-theme-moon'} viewBoxWidth={19} viewBoxHeight={19} />
                  </a>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>

      <RequireJs path="header" defer />
      <RequireCss path="b-header" />
    </header>
  );
};

export default Header;
