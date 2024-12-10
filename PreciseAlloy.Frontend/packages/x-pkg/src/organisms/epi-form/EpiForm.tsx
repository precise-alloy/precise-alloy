import RequireCss from '@helpers/RequireCss';
import { EpiFormModel } from '@_types/organisms';
import { Button } from './Button';
import { TextArea } from './TextArea';
import { TextField } from './TextField';

const EpiForm = (model: EpiFormModel) => {
  const { email, message, name, action, submitButton } = model;

  return (
    <>
      <form action={action} method="POST">
        <TextField {...name} />

        <TextField {...email} />

        <TextArea {...message} />

        <Button {...submitButton}></Button>
      </form>
      <RequireCss path="b-epi-form" />
    </>
  );
};

export { EpiForm };
