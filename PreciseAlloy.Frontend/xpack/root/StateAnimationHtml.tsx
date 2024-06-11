export default function StateAnimationHtml(model: { keyExist: boolean }) {
  return model.keyExist ? (
    <></>
  ) : (
    <div className="pl-state-toggle__circles">
      <div className="pl-state-toggle__circle"></div>
      <div className="pl-state-toggle__circle"></div>
      <div className="pl-state-toggle__circle"></div>
      <div className="pl-state-toggle__circle"></div>
      <div className="pl-state-toggle__circle"></div>
      <div className="pl-state-toggle__circle"></div>
      <div className="pl-state-toggle__circle"></div>
      <div className="pl-state-toggle__circle"></div>
      <div className="pl-state-toggle__circle"></div>
      <div className="pl-state-toggle__circle"></div>
    </div>
  );
}
