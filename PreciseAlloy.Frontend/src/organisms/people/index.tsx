import { AvatarModel, PeopleModel } from '@_types/organisms';
import Avatar from '@organisms/avatar';
import Button from '@atoms/buttons';
import { useEffect, useState } from 'react';
import { getAllAvatars } from '@_api/avatar';

const People = (model: PeopleModel) => {
  const { subHeader, header, text, button } = model;
  const [items, setItems] = useState<AvatarModel[]>([]);

  useEffect(() => {
    getAllAvatars()
      .then((data: AvatarModel[]) => {
        setItems(data);
      })
      .catch(console.error);
  }, []);

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
