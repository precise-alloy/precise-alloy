import RequireCss from '@helpers/RequireCss';

const Header = () => {
  return (
    <header className="zzz-header">
      <div className="zzz-container">
        <div>
          <a href="#">
            <img className="zzz-header__logo" src="/assets/images/logo.svg" />
          </a>
        </div>
      </div>
      <RequireCss path="b-header" />
    </header>
  );
};

export default Header;
