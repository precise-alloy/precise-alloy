const ErrorMessage = (model: ErrorMessageModel) => {
  const { error } = model;
  const modifiers = getModifiers(model, 'zzz-a-error-message');

  return <div className={modifiers}>{error}</div>;
};

export { ErrorMessage };
export default ErrorMessage;
