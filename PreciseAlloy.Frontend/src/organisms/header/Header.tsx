import { getModifiers } from '@helpers/functions';
import RequireCss from '@helpers/RequireCss';
import { HeaderModel } from '@_types/organisms';
import { useState } from 'react';

const Header = (model: HeaderModel) => {
  const modifiers = getModifiers(model, 'zzz-o-header');
  const { title, navlinks, logo } = model;
  const defaultLogoUrl = '/assets/images/logo.svg';
  const [navActive, setNavActive] = useState(false);

  return (
    <header className={modifiers}>
      <div className="zzz-container">
        <div className="zzz-o-header__header-container">
          <a href="#">
            <img className="zzz-o-header__logo" src={logo?.src ?? defaultLogoUrl} />
          </a>

          <span className="zzz-o-header__title">{title}</span>

          {navlinks?.links && (
            <nav className="zzz-o-header__nav-container">
              <div
                className={`zzz-o-header__nav-mobile `}
                onClick={() => {
                  setNavActive((navActive) => !navActive);
                }}
              >
                <a href="#!" className={`zzz-o-header__nav-toggle ${navActive ? 'active' : ''}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </a>
              </div>

              <ul className={`zzz-o-header__nav-list ${navActive ? 'active' : ''}`}>
                {navlinks.links.map((link) => (
                  <li className="zzz-o-header__nav-item">
                    <a key={link.text} href={link.url}>
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
      <RequireCss path="b-header" />
    </header>
  );
};

export default Header;
