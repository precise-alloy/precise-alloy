

const setupHeader = () => {
  const el = document.querySelector('.zzz-o-header');

  if (!el) return;

  const button = el.querySelector<HTMLElement>('.zzz-o-header__nav-toggle');
  const navList = el.querySelector<HTMLElement>('.zzz-o-header__nav-list');

  if (!button || !navList) return;

  button.addEventListener('click', (e) => {
    button.classList.toggle('active');
    navList.classList.toggle('active');
  })

  navList.onOutsideClick(() => {
    button.classList.remove('active');
    navList.classList.remove('active');
  }, [button])
}

setupHeader();

export { }