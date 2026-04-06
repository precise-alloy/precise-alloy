import RequireCss from '@helpers/RequireCss';

import { Button } from './button';
import { TextArea } from './text-area';
import { TextField } from './text-field';

const EpiForm = (model: EpiFormModel) => {
  const { email, message, name, action, submitButton } = model;

  return (
    <>
      <form action={action} method="POST">
        <TextField {...name} />

        <TextField {...email} />

        <TextArea {...message} />

        <Button {...submitButton} />
      </form>
      <RequireCss path="b-epi-form" />
    </>
  );
};

export { EpiForm };
