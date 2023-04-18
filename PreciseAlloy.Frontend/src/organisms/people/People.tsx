import { PeopleModel } from '@_types/organisms';
import RequireCss from '@helpers/RequireCss';
import Avatar from '@organisms/avatar/Avatar';
import Button from '@atoms/buttons/Button';

const People = (model: PeopleModel) => {
  const { subHeader, header, text, items, button } = model;

  return (
    <section className="zzz-o-people section-margin-top-xl">
      <div className="zzz-o-people__content">
        {subHeader && <h3 className="zzz-o-people__sub-header">{subHeader}</h3>}
        {header && <h2 className="zzz-o-people__header h1">{header}</h2>}
        {text && <div className="zzz-o-people__text" dangerouslySetInnerHTML={{ __html: text }}></div>}
      </div>

      {items && items.length && (
        <div className="zzz-o-people__items">
          {items.map((item, index) => (
            <Avatar {...item} key={index} />
          ))}
        </div>
      )}

      {button && <Button {...button}></Button>}
    </section>
  );
};

export default People;
