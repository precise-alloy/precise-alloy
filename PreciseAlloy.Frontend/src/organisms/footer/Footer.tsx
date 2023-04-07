import RequireCss from '@helpers/RequireCss';

const Footer = () => {
  return (
    <footer className="zzz-o-footer">
      <div className="zzz-o-footer__container zzz-container">
        <ul className="zzz-o-footer__social-list">
          <li>
            <a href="#">Facebook</a>
          </li>
          <li>
            <a href="#">Instagram</a>
          </li>
        </ul>
        <div className="zzz-o-footer__copyright">
          <p>© Start, 2022. All rights reserved.</p>
        </div>
      </div>
      <RequireCss path="b-footer" />
    </footer>
  );
};

export default Footer;
