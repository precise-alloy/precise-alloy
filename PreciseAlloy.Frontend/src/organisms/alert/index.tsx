import { AlertModel } from '@_types/organisms';
import RequireCss from '@helpers/RequireCss';

const Alert = (model: AlertModel) => {
  const { heading, items } = model;

  return (
    <section className="zzz-o-alert">
      <div className="zzz-container">
        {heading && <h2 className="zzz-o-alert__heading h4">{heading}</h2>}
        {items?.length && items.map((item, index) => <p dangerouslySetInnerHTML={{ __html: item }} key={index} className="zzz-o-alert__item" />)}
      </div>
      <RequireCss path="b-alert" />
    </section>
  );
};

export default Alert;
